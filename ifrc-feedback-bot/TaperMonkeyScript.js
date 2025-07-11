// ==UserScript==
// @name         IFRC Feedback Form Auto-Filler (No Autre, 5s Delay)
// @namespace    http://tampermonkey.net/
// @version      6.7
// @description  Fills IFRC feedback form 50 times, only Ijoukak or Talat_N_Yaaqoub for commune, never picks Autre/Other for village, 5s delay
// @match        https://ee.ifrc.org/x/5x6PxyDj
// @grant        none
// ==/UserScript==

(function() {
    // --- Your Data ---
    const NomdeCollecteurdeDonnees = "Yasser Baouzil";
    const languages = ["Arabe", "Amazigh"];
    const feedbackChannels = ["ligne_d_assistance_t_l_phoniqu"];
    const sexes = Array(9).fill("Homme").concat(["Femme"]);
    const ageRanges = ["dont_know"];
    const CommentairedeRetourdInfo = ["layrhem lwalidin", "Chokran bzaf Had lmu3wana jat fw9tha", "Layhfdkum u lah ijazikum"];
    const diversities = ["Aucune"];
    const feedbackTypes = [
        "encouragement__compliment_ou_remerciemen"
    ];
    const sensitiveTypes = ["Non sensible"];
    const statusTypes = ["Ferme reponse donnee"];
    const NomdelaPersonne = "N/A";
    const Mesures_prises = ["مرحبا", "لا شكر على واجب"];

    // --- Date Helper ---
    const Days = {
        may2025Weekdays : {
            Monday:    [5, 12, 19, 26],
            Tuesday:   [6, 13, 20, 27],
            Wednesday: [7, 14, 21, 28],
            Thursday:  [1, 8, 15, 22, 29],
            Friday:    [2, 9, 16, 23, 30]
        },
        june2025Weekdays : {
            Monday:    [2, 9, 16, 23, 30],
            Tuesday:   [3, 10, 17, 24],
            Wednesday: [4, 11, 18, 25],
            Thursday:  [5, 12, 19, 26],
            Friday:    [6, 13, 20, 27]
        }
    };

    const allowedCommunes = ["Ijoukak", "Talat_N_Yaaqoub"];

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function setFieldValue(element, value) {
        if (!element) return;
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function waitForSelector(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if ((elapsed += interval) >= timeout) {
                    clearInterval(timer);
                    reject(new Error('Timeout waiting for selector: ' + selector));
                }
            }, interval);
        });
    }

    function clickRadioByValue(name, value) {
        const input = document.querySelector(`input[type="radio"][name="${name}"][value="${value}"]`);
        if (!input) return false;
        const label = input.closest('label');
        if (label) {
            label.click();
            return true;
        }
        input.click();
        return true;
    }

    function getRandomDateString() {
        const months = [
            {name: "may2025Weekdays", month: 5, year: 2025},
            {name: "june2025Weekdays", month: 6, year: 2025}
        ];
        const monthObj = pick(months);
        const weekdays = Object.keys(Days[monthObj.name]);
        const weekday = pick(weekdays);
        const day = pick(Days[monthObj.name][weekday]);
        const mm = String(monthObj.month).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${monthObj.year}-${mm}-${dd}`;
    }

    let tries = 0;
    const maxTries = 50;

    async function fillForm() {
        // 1. Date
        const dateString = getRandomDateString();
        const visibleDateInput = await waitForSelector('input[type="text"][placeholder="yyyy-mm-dd"]');
        setFieldValue(visibleDateInput, dateString);
        const hiddenDateInput = document.querySelector('input[name="/aX7yQrqvg8KwrU8Az64moB/intro/date"]');
        if (hiddenDateInput) setFieldValue(hiddenDateInput, dateString);

        // 2. Branch (ElHaouz)
        await waitForSelector('input[type="radio"][name="/aX7yQrqvg8KwrU8Az64moB/intro/branch"][value="ElHaouz"]');
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/intro/branch', 'ElHaouz');

        // 3. Wait for Commune radios to appear, then pick one of the allowed
        await waitForSelector('input[type="radio"][name="/aX7yQrqvg8KwrU8Az64moB/intro/commune"]');
        const communeInputs = Array.from(document.querySelectorAll('input[type="radio"][name="/aX7yQrqvg8KwrU8Az64moB/intro/commune"]'))
            .filter(input => allowedCommunes.includes(input.value));
        const communeInput = pick(communeInputs);
        communeInput.closest('label').click();

        // 4. Wait for Village radios to appear, then pick one from DOM (not Autre/Other)
        await waitForSelector('input[type="radio"][name="/aX7yQrqvg8KwrU8Az64moB/intro/village"]');
        const villageInputs = Array.from(document.querySelectorAll('input[type="radio"][name="/aX7yQrqvg8KwrU8Az64moB/intro/village"]'))
            .filter(input => {
                const label = input.closest('label');
                const labelText = label ? label.textContent.toLowerCase() : "";
                return !/autre|other/.test(input.value.toLowerCase()) && !/autre|other/.test(labelText);
            });
        if (villageInputs.length > 0) {
            pick(villageInputs).closest('label').click();
        }

        // 5. Collector Name (text)
        const collectorInput = await waitForSelector('input[name="/aX7yQrqvg8KwrU8Az64moB/intro/feedback_collector"]');
        setFieldValue(collectorInput, NomdeCollecteurdeDonnees);

        // 6. Feedback Channel (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/feedback_channel', feedbackChannels[0]);

        // 7. Sexe (radio, men bias)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/sexe', pick(sexes));

        // 8. Age (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/age_range', ageRanges[0]);

        // 9. Diversity (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/diversity_factors_other', diversities[0]);

        // 10. Language (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/Langue', pick(languages));

        // 11. Feedback Type (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/Type_de_retour_d_information', pick(feedbackTypes));

        // 12. Sensitive Type (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/sensitivity', sensitiveTypes[0]);

        // 13. Status Type (radio)
        clickRadioByValue('/aX7yQrqvg8KwrU8Az64moB/urgence', statusTypes[0]);

        // 14. Feedback Comment (text)
        const commentInput = document.querySelector('input[name="/aX7yQrqvg8KwrU8Az64moB/feedback_comment"]');
        if (commentInput) setFieldValue(commentInput, pick(CommentairedeRetourdInfo));

        // 15. Name of feedback provider (text)
        const providerInput = document.querySelector('input[name="/aX7yQrqvg8KwrU8Az64moB/name_feedback_provider"]');
        if (providerInput) setFieldValue(providerInput, NomdelaPersonne);

        // 16. Measures taken (text)
        const measuresInput = document.querySelector('input[name="/aX7yQrqvg8KwrU8Az64moB/Mesures_prises"]');
        if (measuresInput) setFieldValue(measuresInput, pick(Mesures_prises));

        tries++;
        alert(`Form filled! Try #${tries} of ${maxTries}. You have 5 seconds to review and submit.`);
        if (tries < maxTries) {
            setTimeout(() => location.reload(), 5000); // 5 seconds
        } else {
            alert("All 50 tries are done!");
        }
    }

    window.addEventListener('load', fillForm);
})();