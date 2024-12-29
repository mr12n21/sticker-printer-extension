// Pevné nastavení
const BASE_URL = "https://pms.previo.app/"; // Základní část URL
const URL_PATTERN = /\/reservations\/export-grid\/$/; // Vzor pro kontrolu URL
const SAVE_DIRECTORY = "/mnt/network-folder"; // Cílová složka pro ukládání souborů

// Funkce pro detekci URL podle vzoru
function matchesDynamicURL(url) {
  // Zkontroluje, zda URL začíná na BASE_URL a obsahuje dynamickou část odpovídající vzoru
  return url.startsWith(BASE_URL) && URL_PATTERN.test(url);
}

// Sledování dokončených požadavků
chrome.webRequest.onCompleted.addListener(
  function (details) {
    const url = details.url;

    // Kontrola, zda URL odpovídá dynamickému vzoru
    if (matchesDynamicURL(url)) {
      // Generování názvu souboru na základě části URL
      const dynamicPart = url.split('/')[3]; // Extrahuje dynamické číslo z URL
      const fileName = `export_${dynamicPart}.pdf`; // Název souboru
      const savePath = `${SAVE_DIRECTORY}/${fileName}`;

      // Automatické stahování souboru
      chrome.downloads.download({
        url: url,
        filename: savePath, // Relativní cesta
        conflictAction: "overwrite" // Přepsat soubor, pokud již existuje
      }, function (downloadId) {
        if (downloadId) {
          console.log(`Soubor ${fileName} byl uložen jako ${savePath}`);
        } else {
          console.error(`Chyba při stahování souboru ${fileName}`);
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);
