Write-Host "Copying React Bits components to frontend..." -ForegroundColor Green
Write-Host ""

$sourceDir = 'L:\bin'
$destDir = 'C:\Users\iamra\OneDrive\Desktop\Hiresense\frontend\src\components'

$components = @(
    "Antigravity",
    "CircularGallery",
    "ClickSpark",
    "Counter",
    "Cubes",
    "DarkVeil",
    "ElectricBorder",
    "FlowingMenu",
    "GhostCursor",
    "GlassIcons",
    "GradualBlur",
    "ImageTrail",
    "LaserFlow",
    "LetterGlitch",
    "LightPillar",
    "LiquidEther",
    "LogoLoop",
    "MagicBento",
    "Magnet",
    "MagnetLines",
    "MetallicPaint",
    "Orb",
    "OrbitImages",
    "PillNav",
    "PixelSnow",
    "PixelTrail",
    "PixelTransition",
    "Prism",
    "ScrollStack",
    "ShapeBlur",
    "Silk",
    "SplashCursor",
    "Stepper",
    "TargetCursor",
    "Threads",
    "TiltedCard"
)

$total = $components.Count
$count = 0

foreach ($component in $components) {
    $count++
    $sourceFile = "$sourceDir\$component.txt"
    $destFile = "$destDir\$component.jsx"
    
    if (Test-Path $sourceFile) {
        Write-Host "[$count/$total] Copying $component..." -ForegroundColor Cyan
        Copy-Item $sourceFile $destFile -Force
    } else {
        Write-Host "[$count/$total] MISSING: $component.txt" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! All components copied to:" -ForegroundColor Green
Write-Host "$destDir" -ForegroundColor Yellow
