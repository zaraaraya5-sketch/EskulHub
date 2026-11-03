Add-Type -AssemblyName System.Drawing

function Optimize-ImageFile {
    param(
        [string]$FilePath,
        [int]$MaxWidth = 1200,
        [long]$Quality = 82
    )

    if (-not (Test-Path $FilePath)) {
        Write-Host "File not found: $FilePath"
        return
    }

    $fullPath = (Get-Item $FilePath).FullName
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($ms)

    $origW = $img.Width
    $origH = $img.Height

    if ($origW -gt $MaxWidth) {
        $newW = $MaxWidth
        $newH = [int](($origH / $origW) * $MaxWidth)
    } else {
        $newW = $origW
        $newH = $origH
    }

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $newW, $newH)

    $img.Dispose()
    $ms.Dispose()
    $g.Dispose()

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

    $tempPath = $fullPath + '.tmp'
    $bmp.Save($tempPath, $codec, $encoderParams)
    $bmp.Dispose()

    Move-Item -Path $tempPath -Destination $fullPath -Force
    $newSize = (Get-Item $fullPath).Length
    Write-Host "Optimized $FilePath : $origW x $origH -> $newW x $newH ($([math]::Round($newSize/1KB, 1)) KB)"
}

Optimize-ImageFile -FilePath "public/images/PMR.jpeg" -MaxWidth 960 -Quality 78
Copy-Item "public/images/PMR.jpeg" "public/images/PMR.jpg" -Force

Optimize-ImageFile -FilePath "public/images/voli.jpeg" -MaxWidth 960 -Quality 78
Copy-Item "public/images/voli.jpeg" "public/images/voli.jpg" -Force

Optimize-ImageFile -FilePath "public/images/Rohis.jpeg" -MaxWidth 960 -Quality 78
Copy-Item "public/images/Rohis.jpeg" "public/images/Rohis.jpg" -Force

Optimize-ImageFile -FilePath "public/images/pramuka.jpeg" -MaxWidth 960 -Quality 78
Copy-Item "public/images/pramuka.jpeg" "public/images/pramuka.jpg" -Force
