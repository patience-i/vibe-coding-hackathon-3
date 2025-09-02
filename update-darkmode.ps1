# PowerShell script to update dark mode script references in all HTML files

# Get all HTML files in the website directory
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if the file already has the dark-mode.js reference
    if ($content -match "dark-mode\.js") {
        Write-Host "Skipping $($file.FullName) - already has dark-mode.js reference"
        continue
    }
    
    # Determine relative path prefix based on folder depth
    $depth = ($file.DirectoryName.Split("\") | Measure-Object).Count - ($pwd.Path.Split("\") | Measure-Object).Count
    $prefix = "../" * $depth
    if ($depth -eq 0) { $prefix = "" }
    
    # Build the script tag for dark-mode.js
    $darkModeScript = "<script src=`"${prefix}assets/js/dark-mode.js`"></script>"
    
    # Check if file has main.js reference
    if ($content -match "<script src=(`"|')(.*?)main\.js(`"|')") {
        # Insert dark-mode.js before main.js
        $content = $content -replace "(<script src=(`"|')(.*?)main\.js(`"|'))", "$darkModeScript`n    $1"
    } else {
        # Insert dark-mode.js before </body> tag if no main.js
        $content = $content -replace "(\s*</body>)", "`n    $darkModeScript$1"
    }
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated $($file.FullName) - added dark-mode.js reference"
}

Write-Host "Done updating dark mode references in all HTML files!"
