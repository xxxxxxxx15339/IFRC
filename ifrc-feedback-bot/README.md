# IFRC Feedback Form Auto-Filler

## Overview
This project automates the process of filling out the IFRC (International Federation of Red Cross and Red Crescent Societies) feedback form at [https://ee.ifrc.org/x/5x6PxyDj](https://ee.ifrc.org/x/5x6PxyDj). It is designed to help with rapid, randomized data entry for testing or demonstration purposes, using only real data provided in `script.js`.

## Features
- **Automated Form Filling:** Fills all required fields in the IFRC feedback form, including dynamic fields (commune and village).
- **Randomized Data:** Uses only the data you provided (dates, communes, villages, comments, etc.) for realistic randomization.
- **Men Bias:** Makes 'Homme' (men) much more likely than 'Femme' (women) in the gender field.
- **No 'Autre' Selection:** Never selects 'Autre' (Other) for commune or village.
- **Multiple Tries:** Automatically fills the form up to 50 times, with a 5-second delay between each try for manual submission.

## Data Structure
- **script.js** contains all the data used for randomization:
  - Weekday dates for May and June 2025 (excluding weekends)
  - Communes and villages (only Ijoukak and Talat N'Yaaqoub, with their respective villages)
  - Collector name, languages, feedback channels, gender, age ranges, comments, diversity, feedback types, sensitivity, status, and measures taken

## How to Use
1. **Install Tampermonkey Extension:**
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

2. **Add the Script:**
   - Open `TaperMonkeyScript.js`.
   - Copy the entire contents.
   - Click the Tampermonkey icon in your browser and select "Create a new script...".
   - Paste the code and save.

3. **Use the Script:**
   - Go to [https://ee.ifrc.org/x/5x6PxyDj](https://ee.ifrc.org/x/5x6PxyDj).
   - The script will automatically fill the form with randomized data from your dataset.
   - You have 5 seconds to review and submit each time before the page reloads for the next try (up to 50 times).

## Credits
- Data and logic provided by the user in `script.js`.
- Automation logic and event handling in `TaperMonkeyScript.js`.

---
**Note:** This project is for testing, demonstration, or training purposes only. Do not use for submitting real feedback unless authorized by IFRC or your organization.
