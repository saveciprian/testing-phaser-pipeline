async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        return processData(data);
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
}

function processData(incomingData)
{
    let cleanData = [];
    const rows = incomingData.split("\r\n");
    rows.forEach(row => {
        row = row.split(',');
        cleanData.push(row);
    });
    
    return cleanData;
}

export const menuText = fetchCSV("/languageOptions.csv");
