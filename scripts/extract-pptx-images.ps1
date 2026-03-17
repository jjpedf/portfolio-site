<#
.SYNOPSIS
    Extracts all images from the Strattner PPTX presentation files
    and organises them into /public/projects/[slug]/ for use in the portfolio.

.DESCRIPTION
    PPTX files are ZIP archives. This script:
      1. Copies each .pptx to a temp .zip
      2. Expands the archive and pulls the ppt/media/ folder
      3. Filters to image files only (png, jpg, jpeg, gif, svg, emf, wmf)
      4. Copies them into the target public/projects/[slug]/ directory
         with sequential names: img1.png, img2.jpg, etc.

.HOW TO RUN
    From the repo root (portfolio-v2/):
        powershell -ExecutionPolicy Bypass -File .\scripts\extract-pptx-images.ps1

    The script uses the source paths you provided. Edit $Sources below
    if your file locations differ.

.AFTER RUNNING
    - Review the extracted images in public/projects/[slug]/
    - Delete any non-dashboard images (logos, decorative shapes, icons)
    - The JSON already references /projects/[slug]/img1.png ... img3.png
    - Add or remove entries in lib/i18n/en.json + pt.json to match
      the actual number of usable images per project.
#>

# ── Configuration ──────────────────────────────────────────────────────────────

$RepoRoot   = Split-Path -Parent $PSScriptRoot
$PublicDir  = Join-Path $RepoRoot "public\projects"
$TempDir    = Join-Path $env:TEMP "pptx-extract-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Map: PPTX source path → output slug
$Sources = @(
    @{
        Path = "K:\My Drive\Profissional\Portfolio\Strattner\Apresentaçöes\Strattner - Apresentação diretoria - Gestão de dados e Desenvolvimento BI.pptx"
        Slug = "import-kpi"
        Label = "BI_01 · Import KPI Dashboard"
    },
    @{
        Path = "K:\My Drive\Profissional\Portfolio\Strattner\Apresentaçöes\Strattner - Data Driven - Analista de dados e Desenvolvedor BI OPS.pptx"
        Slug = "import-followup"
        Label = "BI_02 · Import Follow-Up"
    },
    @{
        Path = "K:\My Drive\Profissional\Portfolio\Strattner\Apresentaçöes\Strattner - 2023_01 - Entregas 2022 e PE 2023.pptx"
        Slug = "export-followup"
        Label = "BI_03 · Export Follow-Up"
    },
    @{
        Path = "K:\My Drive\Profissional\Portfolio\Strattner\Apresentaçöes\Strattner - 2023_03 - Planejamento Estratégico 2023.pptx"
        Slug = "otif-service"
        Label = "BI_04 · OTIF Service Level"
    }
)

# BI_05 source is the PDF — handled separately at the end of this script.
# CNX Lakehouse has no PPT; add your own architecture diagram to:
#   public/projects/cnx-lakehouse/img1.png

$ImageExtensions = @('.png', '.jpg', '.jpeg', '.gif', '.svg')

# ── Helpers ────────────────────────────────────────────────────────────────────

function Extract-PptxImages {
    param(
        [string]$PptxPath,
        [string]$OutputSlug,
        [string]$Label
    )

    Write-Host "`n── $Label" -ForegroundColor Cyan
    Write-Host "   Source : $PptxPath"

    if (-not (Test-Path $PptxPath)) {
        Write-Warning "   File not found — skipping. Check the path in `$Sources."
        return
    }

    # Output directory
    $OutDir = Join-Path $PublicDir $OutputSlug
    New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

    # Temp working directory for this file
    $WorkDir = Join-Path $TempDir $OutputSlug
    New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null

    # Copy .pptx → .zip
    $ZipPath = Join-Path $WorkDir "source.zip"
    Copy-Item -Path $PptxPath -Destination $ZipPath -Force

    # Expand archive
    $ExtractDir = Join-Path $WorkDir "extracted"
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

    # Find media folder
    $MediaDir = Join-Path $ExtractDir "ppt\media"
    if (-not (Test-Path $MediaDir)) {
        Write-Warning "   No ppt\media\ folder found in archive — no images embedded."
        return
    }

    # Get image files only (skip .emf/.wmf vector shapes that are usually decorative)
    $Images = Get-ChildItem -Path $MediaDir -File |
              Where-Object { $ImageExtensions -contains $_.Extension.ToLower() } |
              Sort-Object Name

    Write-Host "   Found  : $($Images.Count) image(s)" -ForegroundColor Green

    $Counter = 1
    foreach ($Img in $Images) {
        $DestName = "img$Counter$($Img.Extension.ToLower())"
        $DestPath = Join-Path $OutDir $DestName
        Copy-Item -Path $Img.FullName -Destination $DestPath -Force
        Write-Host "   Copied : $($Img.Name) -> $DestName"
        $Counter++
    }

    Write-Host "   Output : $OutDir" -ForegroundColor Green
}

# ── Main ───────────────────────────────────────────────────────────────────────

Write-Host "`n=========================================================" -ForegroundColor DarkCyan
Write-Host "  Strattner BI - PPTX Image Extraction" -ForegroundColor DarkCyan
Write-Host "=========================================================" -ForegroundColor DarkCyan

New-Item -ItemType Directory -Force -Path $TempDir | Out-Null

foreach ($Source in $Sources) {
    Extract-PptxImages -PptxPath $Source.Path -OutputSlug $Source.Slug -Label $Source.Label
}

# ── Handle the PDF source (BI_05 S&OP) ────────────────────────────────────────
Write-Host "`n-- BI_05 - S+OP Inventory (PDF source)" -ForegroundColor Cyan
$PdfSlug   = "saop-inventory"
$PdfOutDir = Join-Path $PublicDir $PdfSlug
New-Item -ItemType Directory -Force -Path $PdfOutDir | Out-Null

Write-Host "   The S+OP source is a PDF. PowerShell cannot extract images from PDF natively." -ForegroundColor Yellow
Write-Host "   Options:" -ForegroundColor Yellow
Write-Host "   1. Open the PDF in Adobe Acrobat, then Export as Image" -ForegroundColor Yellow
Write-Host "   2. Run:  python scripts\extract-pdf-images.py  (requires pymupdf)" -ForegroundColor Yellow
Write-Host "   3. Take screenshots of the key dashboard slides directly." -ForegroundColor Yellow
Write-Host "   Place result images in: $PdfOutDir" -ForegroundColor Yellow

# ── Handle CNX Lakehouse ───────────────────────────────────────────────────────
Write-Host "`n-- FEATURED - CNX Data Lakehouse" -ForegroundColor Cyan
$CnxOutDir = Join-Path $PublicDir "cnx-lakehouse"
New-Item -ItemType Directory -Force -Path $CnxOutDir | Out-Null
Write-Host "   Directory created: $CnxOutDir" -ForegroundColor Green
Write-Host "   Add your architecture diagram or screenshot as img1.png" -ForegroundColor Yellow

# ── Cleanup ────────────────────────────────────────────────────────────────────
Write-Host "`n-- Cleaning up temp files..." -ForegroundColor DarkGray
Remove-Item -Recurse -Force -Path $TempDir -ErrorAction SilentlyContinue
Write-Host "   Done." -ForegroundColor DarkGray

Write-Host "`n=========================================================" -ForegroundColor DarkCyan
Write-Host "  Extraction complete." -ForegroundColor DarkCyan
Write-Host "  Review images in public/projects/" -ForegroundColor DarkCyan
Write-Host "  Delete decorative/non-dashboard images before deploying." -ForegroundColor DarkCyan
Write-Host "=========================================================`n" -ForegroundColor DarkCyan
