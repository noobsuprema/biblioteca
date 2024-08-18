document.addEventListener('DOMContentLoaded', () => {
  let allBooks = [];
  const emptyBookList = document.querySelector("#emptyBookList");
  const fields = document.querySelectorAll("input");
  const modal = document.querySelector("#myModal");
  const modalTitle = document.querySelector("#modalTitle");
  const synopsis = document.querySelector("#synopsis");
  const txtSynopsis = document.querySelector("#txtSynopsis");
  const btnRegister = document.querySelector("#btnRegister");
  const btnSearch = document.querySelector("#btnSearch");

  function findBook(bookName) {
    return allBooks.findIndex((elem) => elem.bookName === bookName);
  }

  function showSynopsis(event) {
    if (event.target.id === "btnSinopsys") {
      const bookName = event.target.parentNode.querySelector("#bookTitle").textContent;
      const index = findBook(bookName);
      if (index !== -1) {
        modalTitle.innerHTML = `Sinopse do livro "${allBooks[index].bookName}"`;
        txtSynopsis.innerHTML = allBooks[index].synopsis;
        modal.style.display = "block";
      }
    }
  }

  function showError(bookName) {
    const contentModel = document.querySelector("#contentModel");
    modalTitle.innerHTML = `Livro "${bookName}" não encontrado!`;
    txtSynopsis.innerHTML = "";
    contentModel.style.width = "50%";
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function closeModalWindow(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

  function clearFields() {
    fields.forEach(function (elem) {
      elem.value = "";
    });
    synopsis.value = "";
  }

  function createCard(bookCard, bookName, bookAuthor, bookPublisher, numberOfPages, bookCover) {
    bookCard.className = bookName;
    bookCard.innerHTML = `
      <p id="bookTitle">${bookName}</p>
      <img src="${bookCover}" alt="${bookName}"/>
      Autor: ${bookAuthor}
      <br>Editora: ${bookPublisher}
      <br>Páginas: ${numberOfPages}
      <button id="btnSinopsys">Sinopse</button>
      <button id="btnRemove">Remover</button>
    `;
  }

  function appendElements(divSelect, bookCard) {
    const btnCloseModal = document.querySelector("#btnCloseModal");
    divSelect.append(bookCard);
    divSelect.addEventListener("click", showSynopsis);
    btnCloseModal.addEventListener("click", closeModal);
    window.addEventListener("click", closeModalWindow);
  }

  function removeCard(parentDiv) {
    return function remove(event) {
      if (event.target.id === "btnRemove") {
        const bookName = event.target.parentNode.querySelector("#bookTitle").textContent;
        parentDiv.removeChild(event.target.parentNode);
        const index = findBook(bookName);
        if (index !== -1) {
          allBooks.splice(index, 1);
          alert(`Livro "${bookName}" removido com sucesso!`);
          if (allBooks.length === 0) {
            emptyBookList.style.display = 'block';
          }
        }
      }
    }
  }

  function registerBook(event) {
    event.preventDefault(); // Impede o envio do formulário

    const listOfAllBooks = document.querySelector("#listOfAllBooks");
    const bookName = document.querySelector("#bookName").value;
    const bookAuthor = document.querySelector("#bookAuthor").value;
    const bookPublisher = document.querySelector("#bookPublisher").value;
    const numberOfPages = Number(document.querySelector("#numberOfPages").value);
    const bookCover = document.querySelector("#bookCover").value;

    allBooks.push({
      bookName,
      bookAuthor,
      bookPublisher,
      numberOfPages,
      bookCover,
      synopsis: synopsis.value
    });

    emptyBookList.style.display = 'none';
    const bookCard = document.createElement("div");

    createCard(bookCard, bookName, bookAuthor, bookPublisher, numberOfPages, bookCover);
    appendElements(listOfAllBooks, bookCard);

    const remove = removeCard(listOfAllBooks);
    listOfAllBooks.addEventListener("click", remove);

    clearFields();
  }

  function searchBook() {
    const bookNameSearch = document.querySelector("#bookNameSearch").value;
    const listOfBooksSearch = document.querySelector("#listOfBooksSearch");
    const foundBooks = document.querySelector("#foundBooks");
    foundBooks.innerHTML = '';

    const findBook = allBooks.filter(elem => elem.bookName === bookNameSearch);

    if (findBook.length !== 0) {
      findBook.forEach(elem => {
        const bookCard = document.createElement("div");
        createCard(bookCard, elem.bookName, elem.bookAuthor, elem.bookPublisher, elem.numberOfPages, elem.bookCover);
        appendElements(foundBooks, bookCard);
      });
    } else {
      showError(bookNameSearch);
    }

    const remove = removeCard(foundBooks);
    foundBooks.addEventListener("click", remove);

    clearFields();
  }

  btnRegister.addEventListener("click", registerBook);
  btnSearch.addEventListener("click", searchBook);
});
