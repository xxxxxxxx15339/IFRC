# Committee-Douar Excel Cleaner & Mapper

This project processes an Excel file containing committee and douar (village) data, cleans and deduplicates the entries, and generates a new Excel file with unique IDs for each douar. It also provides interactive and automated options for resolving fuzzy duplicates, and is ready for future automation (such as web form filling).

## Features
- **Moves and normalizes table data** from a source Excel file
- **Deduplicates committee and douar names** using fuzzy matching (with user confirmation)
- **Assigns unique IDs** to each douar (e.g., H01, H02, ...)
- **Outputs a clean, sorted Excel file** (`Douar_Final.xlsx`) with columns: Committee, Douar, ID
- **Interactive prompts** for resolving ambiguous matches, with a `SkipAll` option to skip all prompts and save immediately

## Requirements
- Python 3.7+
- `openpyxl`

Install dependencies:
```bash
pip install openpyxl
```

## Usage
1. Place your source Excel file (e.g., `New Douars.xlsx`) in the project directory.
2. Edit `script.py` if you need to change column mappings or thresholds.
3. Run the script:
   ```bash
   python script.py
   ```
4. Follow the interactive prompts to resolve fuzzy matches, or type `SkipAll` at any prompt to skip all further questions and save the current results.
5. The cleaned and deduplicated data will be saved to `Douar_Final.xlsx` in the format:

   | Committee | Douar | ID |
   |-----------|-------|----|
   | ...       | ...   | ...|

## SkipAll Feature
- At any prompt, type `SkipAll` to immediately skip all further deduplication/merging and save the current state to `Douar_Final.xlsx`.
- The output will always be sorted by committee and douar (case-insensitive).

## Future Automation
This project is ready to be extended for web automation (e.g., filling out web forms using the cleaned Excel data). See `script.py` for where to add Selenium or other automation code.

## License
MIT
