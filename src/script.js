// Mengambil data buku dari Open Library API
async function getBooks() {
    const container = document.querySelector("#books-container");

    try {
        const response = await fetch(
            "https://openlibrary.org/search.json?q=fiction&limit=5"
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil data buku.");
        }

        const data = await response.json();

        container.innerHTML = "";

        data.docs.forEach((book) => {
            const card = document.createElement("article");
            card.className = "rounded-xl bg-white p-4 shadow-sm";

            // Cover buku
            const cover = document.createElement("img");

            if (book.cover_i) {
                cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            } else {
                cover.alt = "Cover tidak tersedia";
            }

            cover.alt = `Cover ${book.title}`;
            cover.className =
                "w-full h-64 object-contain rounded-lg bg-[#f1f1e9]";

            // Judul buku
            const title = document.createElement("h3");
            title.textContent = book.title || "Judul tidak tersedia";
            title.className = "mt-4 font-serif text-lg";

            // Nama penulis
            const author = document.createElement("p");
            author.textContent =
                book.author_name?.join(", ") || "Penulis tidak diketahui";
            author.className = "mt-1 text-sm text-gray-500";

            // Tahun terbit
            const year = document.createElement("p");
            year.textContent = book.first_publish_year
                ? `Terbit ${book.first_publish_year}`
                : "Tahun terbit tidak tersedia";
            year.className = "mt-3 text-xs text-[#71816b]";

            card.append(cover, title, author, year);
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "";

        const message = document.createElement("p");
        message.textContent =
            "Gagal mengambil data buku. Silakan coba lagi.";
        message.className = "col-span-full text-gray-500";

        container.appendChild(message);
        console.error(error);
    }
}

// Menjalankan fungsi
getBooks();

// Fungsi pencarian buku
async function searchBooks() {
    const input = document.querySelector("#search-input");
    const keyword = input.value.trim();

    if (!keyword) {
        alert("Masukkan judul, penulis, atau genre buku!");
        return;
    }

    const container = document.querySelector("#books-container");

    container.innerHTML = `
        <p class="col-span-full text-gray-500">
            Mencari buku...
        </p>
    `;

    try {
        const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}&limit=5`
        );

        if (!response.ok) {
            throw new Error("Gagal mencari buku.");
        }

        const data = await response.json();

        container.innerHTML = "";

        if (data.docs.length === 0) {
            container.innerHTML = `
                <p class="col-span-full text-gray-500">
                    Buku tidak ditemukan.
                </p>
            `;
            return;
        }

        data.docs.forEach((book) => {
            const card = document.createElement("article");
            card.className = "rounded-xl bg-white p-4 shadow-sm";

            const cover = document.createElement("img");

            if (book.cover_i) {
                cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            } else {
                cover.src = "https://placehold.co/300x400?text=No+Cover";
            }

            cover.alt = `Cover ${book.title || "buku"}`;
            cover.className =
                "w-full h-64 object-contain rounded-lg bg-[#f1f1e9]";

            const title = document.createElement("h3");
            title.textContent = book.title || "Judul tidak tersedia";
            title.className = "mt-4 font-serif text-lg";

            const author = document.createElement("p");
            author.textContent =
                book.author_name?.join(", ") || "Penulis tidak diketahui";
            author.className = "mt-1 text-sm text-gray-500";

            const year = document.createElement("p");
            year.textContent = book.first_publish_year
                ? `Terbit ${book.first_publish_year}`
                : "Tahun terbit tidak tersedia";
            year.className = "mt-3 text-xs text-[#71816b]";

            card.append(cover, title, author, year);
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = `
            <p class="col-span-full text-gray-500">
                Pencarian gagal. Silakan coba lagi.
            </p>
        `;

        console.error(error);
    }
}

// Event tombol Cari
document.querySelector("#search-button").addEventListener("click", searchBooks);

// Event tombol Enter
document.querySelector("#search-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBooks();
    }
});

// Event klik pada kategori buku
document.querySelectorAll("[data-category]").forEach((category) => {
    category.addEventListener("click", (event) => {
        event.preventDefault();

        const keyword = category.dataset.category;

        document.querySelector("#search-input").value = keyword;

        searchBooks();
    });
});