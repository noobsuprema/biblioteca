document.getElementById('bookForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const synopsis = document.getElementById('synopsis').value;
    const cover = document.getElementById('cover').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);
    formData.append('synopsis', synopsis);
    formData.append('cover', cover);

    const response = await fetch('/books', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Livro cadastrado com sucesso!');
        loadBooks();
    } else {
        alert('Erro ao cadastrar o livro.');
    }
});

async function loadBooks() {
    const response = await fetch('/books');
    const books = await response.json();

    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <img src="/uploads/${book.cover}" alt="${book.title}">
            <h2>${book.title}</h2>
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Ano:</strong> ${book.year}</p>
            <p>${book.synopsis}</p>
        `;
        bookList.appendChild(bookDiv);
    });
}

loadBooks();
