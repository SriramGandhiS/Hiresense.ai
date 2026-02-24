Write-Host "Installing React Bits components..." -ForegroundColor Green
Write-Host ""

$components = @(
    "@react-bits/ElectricBorder-JS-CSS",
    "@react-bits/OrbitImages-JS-CSS",
    "@react-bits/PixelTransition-JS-CSS",
    "@react-bits/Antigravity-JS-CSS",
    "@react-bits/LogoLoop-JS-CSS",
    "@react-bits/TargetCursor-JS-CSS",
    "@react-bits/LaserFlow-JS-CSS",
    "@react-bits/MagnetLines-JS-CSS",
    "@react-bits/GhostCursor-JS-CSS",
    "@react-bits/GradualBlur-JS-CSS",
    "@react-bits/ClickSpark-JS-CSS",
    "@react-bits/Magnet-JS-CSS",
    "@react-bits/PixelTrail-JS-CSS",
    "@react-bits/Cubes-JS-CSS",
    "@react-bits/MetallicPaint-JS-CSS",
    "@react-bits/ShapeBlur-JS-CSS",
    "@react-bits/ImageTrail-JS-CSS",
    "@react-bits/SplashCursor-JS-CSS",
    "@react-bits/ScrollStack-JS-CSS",
    "@react-bits/MagicBento-JS-CSS",
    "@react-bits/CircularGallery-JS-CSS",
    "@react-bits/PillNav-JS-CSS",
    "@react-bits/TiltedCard-JS-CSS",
    "@react-bits/LiquidEther-JS-CSS",
    "@react-bits/Prism-JS-CSS",
    "@react-bits/DarkVeil-JS-CSS",
    "@react-bits/LightPillar-JS-CSS",
    "@react-bits/Silk-JS-CSS",
    "@react-bits/PixelSnow-JS-CSS",
    "@react-bits/Threads-JS-CSS",
    "@react-bits/Orb-JS-CSS",
    "@react-bits/LetterGlitch-JS-CSS",
    "@react-bits/GlassIcons-JS-CSS",
    "@react-bits/FlowingMenu-JS-CSS",
    "@react-bits/Counter-JS-CSS",
    "@react-bits/Stepper-JS-CSS"
)

$total = $components.Count
$count = 0

foreach ($component in $components) {
    $count++
    Write-Host "[$count/$total] Installing $component..." -ForegroundColor Cyan
    npx shadcn@latest add $component --yes
    Write-Host ""
}

Write-Host "All $total components installed successfully!" -ForegroundColor Green
