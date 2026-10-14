Add-Type -AssemblyName System.Drawing
$taskConfig = Get-Content -Encoding utf8 qa/review-config.json -Raw | ConvertFrom-Json
$taskCatalog = $taskConfig.catalog
New-Item -ItemType Directory -Force qa | Out-Null
$taskSheet = New-Object System.Drawing.Bitmap(1360, ($taskCatalog.Count * 190 + 35))
$taskGraphics = [System.Drawing.Graphics]::FromImage($taskSheet)
$taskGraphics.Clear([System.Drawing.Color]::FromArgb(16,17,14))
$taskFont = New-Object System.Drawing.Font('Arial',9)
$taskBrush = [System.Drawing.Brushes]::White
$taskLevels = @($taskConfig.levels) + @(800)
for ($taskColumn=0; $taskColumn -lt 7; $taskColumn++) { $taskGraphics.DrawString([string]$taskLevels[$taskColumn],$taskFont,$taskBrush,(190 + $taskColumn * 165),8) }
for ($taskRow=0; $taskRow -lt $taskCatalog.Count; $taskRow++) {
 $taskAthlete=$taskCatalog[$taskRow]
 $taskImage=[System.Drawing.Image]::FromFile((Join-Path (Get-Location) ('public/'+$taskAthlete.photo)))
 $taskSize=[Math]::Min($taskImage.Width,$taskImage.Height)*$taskAthlete.crop[2]
 $taskX=[Math]::Max(0,[Math]::Min($taskImage.Width-$taskSize,$taskImage.Width*$taskAthlete.crop[0]-$taskSize/2))
 $taskY=[Math]::Max(0,[Math]::Min($taskImage.Height-$taskSize,$taskImage.Height*$taskAthlete.crop[1]-$taskSize/2))
 $taskGraphics.DrawString($taskAthlete.name,$taskFont,$taskBrush,5,(50+$taskRow*190))
 for ($taskColumn=0; $taskColumn -lt 7; $taskColumn++) {
  $taskRes=$taskLevels[$taskColumn]
  $taskSmall=New-Object System.Drawing.Bitmap($taskRes,$taskRes)
  $taskSmallGraphics=[System.Drawing.Graphics]::FromImage($taskSmall)
  $taskSmallGraphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
  $taskDestination=New-Object System.Drawing.Rectangle(0,0,$taskRes,$taskRes)
  $taskSmallGraphics.DrawImage($taskImage,$taskDestination,$taskX,$taskY,$taskSize,$taskSize,[System.Drawing.GraphicsUnit]::Pixel)
  $taskGraphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $taskGraphics.PixelOffsetMode=[System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $taskGraphics.DrawImage($taskSmall,(190+$taskColumn*165),(35+$taskRow*190),160,160)
  $taskSmallGraphics.Dispose(); $taskSmall.Dispose()
 }
 $taskImage.Dispose()
}
$taskSheet.Save((Join-Path (Get-Location) 'qa/pixel-review.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$taskGraphics.Dispose();$taskFont.Dispose();$taskSheet.Dispose()
Write-Output 'Prancha criada: qa/pixel-review.png'
