// Fungsi untuk memuat data JSON dari file eksternal
async function loadDomainData() {
    try {
        const response = await fetch('domains.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading domain data:', error);
        return null;
    }
}

// Fungsi untuk menghitung kemiripan dua string (Levenshtein Distance)
function calculateLevenshtein(a, b) {
    let tmp;
    let i, j;
    const alen = a.length;
    const blen = b.length;
    const dp = [];

    if (alen === 0) { return blen; }
    if (blen === 0) { return alen; }

    for (i = 0; i <= alen; i++) { dp[i] = [i]; }
    for (j = 0; j <= blen; j++) { dp[0][j] = j; }

    for (i = 1; i <= alen; i++) {
        for (j = 1; j <= blen; j++) {
            tmp = (a[i - 1] === b[j - 1] ? 0 : 1);
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + tmp
            );
        }
    }

    return dp[alen][blen];
}

// Fungsi untuk memeriksa link dan menampilkan hasil
async function checkLink() {
    const domainData = await loadDomainData();
    if (!domainData) {
        document.getElementById('result').innerHTML = '<span class="error">Gagal memuat data domain.</span>';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const linkInput = document.getElementById('linkInput').value.trim();
    const resultDiv = document.getElementById('result');

    // Tampilkan animasi loading
    document.getElementById('loading').style.display = 'flex';

    // Validasi input
    if (!linkInput) {
        resultDiv.innerHTML = '<span class="error">Harap masukkan link.</span>';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    // Cek apakah link menggunakan http atau https
    const isSecure = linkInput.startsWith('https://');
    if (!isSecure) {
        resultDiv.innerHTML = '<span class="error">Link harus menggunakan HTTPS untuk keamanan.</span>';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    try {
        // Extrak domain dari link
        const url = new URL(linkInput);
        const domain = url.hostname;

        // Cek apakah domain termasuk dalam kategori phishing
        let isPhishing = false;
        for (const knownDomain in domainData["Domain Perbankan Indonesia"]) {
            if (calculateLevenshtein(domain, knownDomain) <= 3) { // Jarak Levenshtein threshold
                isPhishing = true;
                break;
            }
        }

        // Cek apakah domain adalah domain resmi dari kategori lain
        if (domainData["Domain Perbankan Indonesia"][domain]) {
            resultDiv.innerHTML = `<span class="safe">Ini adalah domain milik bank di Indonesia.</span><br>Contoh: <a href="${domainData["Domain Perbankan Indonesia"][domain]}" target="_blank">${domainData["Domain Perbankan Indonesia"][domain]}</a>`;
        } else if (domainData["Domain E-Wallet Indonesia"][domain]) {
            resultDiv.innerHTML = `<span class="safe">Ini adalah domain milik e-wallet di Indonesia.</span><br>Contoh: <a href="${domainData["Domain E-Wallet Indonesia"][domain]}" target="_blank">${domainData["Domain E-Wallet Indonesia"][domain]}</a>`;
        } else {
            // Cek apakah domain termasuk dalam domain resmi Indonesia
            let description = '';
            let example = '';
            const domainParts = domain.split('.');
            const domainTLD = '.' + domainParts.slice(-2).join('.');

            if (domainData["Domain Resmi Indonesia"][domainTLD]) {
                description = `Ini adalah domain resmi Indonesia dengan tipe ${domainTLD}. ${domainData["Domain Resmi Indonesia"][domainTLD].description}`;
                example = domainData["Domain Resmi Indonesia"][domainTLD].example;
            }

            // Jika domain mirip dengan domain resmi tapi tidak terdaftar
            if (isPhishing) {
                resultDiv.innerHTML = '<span class="error">Domain ini mungkin merupakan upaya phishing yang meniru domain resmi.</span>';
                // Penjelasan kenapa bisa dianggap phishing
                resultDiv.innerHTML += `<p><strong>Penyebab:</strong> Domain ini mungkin mirip dengan domain resmi yang dikenal, namun tidak terdaftar di basis data kami. Hal ini dapat menunjukkan bahwa domain ini mungkin digunakan untuk phishing, yaitu meniru domain resmi untuk menipu pengguna.</p>`;
            } else if (description) {
                resultDiv.innerHTML = `<span class="safe">${description}</span><br><strong>contoh<strong/>: <a href="${example}" target="_blank">${example}</a>`;
            } else {
                resultDiv.innerHTML = '<span class="error">Domain ini tidak dikenali atau mungkin merupakan phishing.</span>';
                // Penjelasan jika domain tidak dikenali
                resultDiv.innerHTML += `<p><strong>Penyebab:</strong> Domain ini tidak dikenali dalam basis data kami dan mungkin merupakan upaya phishing, yaitu domain yang dirancang untuk menipu dengan meniru domain resmi atau terkenal.</p>`;
            }
        }
    } catch (error) {
        resultDiv.innerHTML = '<span class="error">Terjadi kesalahan saat memproses link.</span>';
    } finally {
        // Sembunyikan animasi loading setelah proses selesai
        document.getElementById('loading').style.display = 'none';
    }
}

// Menambahkan event listener pada form submit
document.getElementById('linkForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form dari reload halaman
    checkLink();
});

// Menambahkan event listener pada tombol refresh
document.getElementById('refreshButton').addEventListener('click', function() {
    document.getElementById('linkInput').value = ''; // Kosongkan input
    document.getElementById('result').innerHTML = ''; // Kosongkan hasil
    document.getElementById('loading').style.display = 'none'; // Sembunyikan animasi loading
});
