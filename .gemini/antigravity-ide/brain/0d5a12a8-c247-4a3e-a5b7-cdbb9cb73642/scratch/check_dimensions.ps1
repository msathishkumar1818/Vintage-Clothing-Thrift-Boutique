Add-Type -AssemblyName System.Drawing
$paths = @(
  'assets/images/hero/hero-vintage-editorial.jpg',
  'assets/images/hero/hero-home2-vault.jpg',
  'assets/images/about/about-cta-bg.jpg',
  'assets/images/about/pillar-community.jpg',
  'assets/images/gallery/community-look-1.jpg',
  'assets/images/gallery/community-look-2.jpg',
  'assets/images/sections/trunk-show-lounge.jpg',
  'assets/images/backgrounds/sell-cta-backdrop.jpg',
  'assets/images/backgrounds/contact-evening-lounge.jpg',
  'assets/images/about/p64.jpg'
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $p))
        Write-Host "$p | $($img.Width)x$($img.Height)"
        $img.Dispose()
    }
}
