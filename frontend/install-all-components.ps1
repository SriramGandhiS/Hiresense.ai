Write-Host "Installing React Bits components into frontend..." -ForegroundColor Green
Write-Host ""

$components = @(
    "electric-border",
    "orbit-images",
    "pixel-transition",
    "antigravity",
    "logo-loop",
    "target-cursor",
    "laser-flow",
    "magnet-lines",
    "ghost-cursor",
    "gradual-blur",
    "click-spark",
    "magnet",
    "pixel-trail",
    "cubes",
    "metallic-paint",
    "shape-blur",
    "image-trail",
    "splash-cursor",
    "scroll-stack",
    "magic-bento",
    "circular-gallery",
    "pill-nav",
    "tilted-card",
    "liquid-ether",
    "prism",
    "dark-veil",
    "light-pillar",
    "silk",
    "pixel-snow",
    "threads",
    "orb",
    "letter-glitch",
    "glass-icons",
    "flowing-menu",
    "counter",
    "stepper"
)

$total = $components.Count
$count = 0

foreach ($component in $components) {
    $count++
    Write-Host "[$count/$total] Installing $component..." -ForegroundColor Cyan
    npx shadcn@latest add @react-bits/$component --yes
    Write-Host ""
}

Write-Host "All $total components installed successfully!" -ForegroundColor Green
