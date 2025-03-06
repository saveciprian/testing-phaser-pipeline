const spreadsheetId = '1rzORCfELUW9GlmpPhz3_92p30Yi4PoiHNx4QJxcZ_4I';
const apiKey = 'AIzaSyBiePGc6deP8mVJuhbPpOj3mp5ZYsEBAqw';

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`;

async function fetchGoogleSheetData() {
    try {
        // Fetch data from Google Sheets API
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data);
        // // Extract rows from the data
        // const rows = data.values;

        // // Get the table body element
        // const tableBody = document.querySelector('#data-table tbody');

        // // Loop through the rows (starting from row 1 to skip headers)
        // for (let i = 1; i < rows.length; i++) {
        //     const row = document.createElement('tr');
            
        //     // Loop through each cell in the row and create a table cell for each
        //     rows[i].forEach(cell => {
        //         const cellElement = document.createElement('td');
        //         cellElement.textContent = cell;
        //         row.appendChild(cellElement);
        //     });
            
        //     // Append the row to the table
        //     tableBody.appendChild(row);
        // }
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
    }
}

// Call the function to fetch and display data
document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);