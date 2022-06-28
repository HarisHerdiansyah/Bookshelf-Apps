const listBooks = [];
const render_event = 'render-book-item';
const save_storage_event = 'save-book-item';
const book_storage_key = 'List Book';
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('search_bar');
const render_search = 'render-search';

document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addBookItem();
  });

  if (checkStorageBrowser()) {
    renderDataFromStorage();
  }
});

document.addEventListener(render_event, function () {
  const completeBook = document.getElementById('completeBookList');
  const uncompleteBook = document.getElementById('uncompleteBookList');

  completeBook.innerHTML = '';
  uncompleteBook.innerHTML = '';

  for (const bookItem of listBooks) {
    const bookItemElement = createBookItemElement(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookItemElement);
    } else {
      uncompleteBook.append(bookItemElement);
    }
  }
});

function generateBookID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function addBookItem() {
  const bookID = generateBookID();
  const titleBook = document.getElementById('title').value;
  const authorBook = document.getElementById('author').value;
  const yearOfBook = document.getElementById('year').value;
  const completeBox = document.getElementById('completeBox').checked;

  const bookItem = generateBookObject(bookID, titleBook, authorBook, yearOfBook, completeBox);
  listBooks.push(bookItem);

  document.dispatchEvent(new Event(render_event));
  saveData();
}

function createBookItemElement({
  id,
  title,
  author,
  year,
  isComplete
}) {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');

  const titleBookElement = document.createElement('h4');
  titleBookElement.innerText = title;

  const authorBookElement = document.createElement('p');
  authorBookElement.innerText = `Author : ${author}`;

  const yearOfBookElement = document.createElement('p');
  yearOfBookElement.innerText = `Tahun : ${year}`;

  const isCompleteBookStatus = document.createElement('p');

  const action = document.createElement('div');
  const switchBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  card.classList.add('card', 'my-4');
  cardBody.classList.add('card-body');
  titleBookElement.classList.add('mb-3', 'title');
  authorBookElement.classList.add('author');
  yearOfBookElement.classList.add('year');
  action.classList.add('action', 'mt-4', 'd-flex', 'flex-wrap', 'gap-2');
  action.append(switchBtn, deleteBtn);
  cardBody.append(titleBookElement, authorBookElement, yearOfBookElement, isCompleteBookStatus, action);
  card.append(cardBody);

  if (isComplete) {
    isCompleteBookStatus.innerText = 'Status : Selesai dibaca';
    switchBtn.innerText = 'Belum selesai dibaca';
    switchBtn.classList.add('btn', 'btn-primary');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = false;
      document.dispatchEvent(new Event(render_event));
      saveData();
    });
  } else {
    isCompleteBookStatus.innerText = 'Status : Belum selesai dibaca';
    switchBtn.innerText = 'Selesai dibaca';
    switchBtn.classList.add('btn', 'btn-success');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = true;
      document.dispatchEvent(new Event(render_event));
      saveData();
    });
  }

  deleteBtn.classList.add('btn', 'btn-danger');
  deleteBtn.innerText = 'Hapus data buku';
  deleteBtn.addEventListener('click', function () {
    const bookItemIndex = searchBookIndex(id);
    if (bookItemIndex == -1) return;

    listBooks.splice(bookItemIndex, 1);
    document.dispatchEvent(new Event(render_event));
    saveData();
  });

  return card;
}

function searchBookItem(bookID) {
  for (const bookItem of listBooks) {
    if (bookItem.id == bookID) {
      return bookItem;
    }
  }

  return null;
}

function searchBookIndex(bookID) {
  for (const i in listBooks) {
    if (listBooks[i].id == bookID) {
      return i;
    }
  }

  return -1;
}

function checkStorageBrowser() {
  if (typeof Storage != undefined) {
    return true;
  }

  return false;
}

function saveData() {
  if (checkStorageBrowser()) {
    const listBooksParse = JSON.stringify(listBooks);
    localStorage.setItem(book_storage_key, listBooksParse);
    document.dispatchEvent(new Event(save_storage_event));
  }
}

function renderDataFromStorage() {
  const getBookData = localStorage.getItem(book_storage_key);
  let dataBook = JSON.parse(getBookData);

  if (dataBook != null) {
    for (const book of dataBook) {
      listBooks.push(book);
    }
  }

  document.dispatchEvent(new Event(render_event));
}

document.addEventListener(render_search, function () {
  for (let i = 0; i < listBooks.length; i++) {
    let searchTitle = document.querySelectorAll('.card-body>.title');
    let searchAuthor = document.querySelectorAll('.card-body>.author');
    let searchYear = document.querySelectorAll('.card-body>.year');

    if (searchTitle[i].textContent.includes(searchBar.value) ||
      searchAuthor[i].textContent.includes(searchBar.value) ||
      searchYear[i].textContent.includes(searchBar.value)) {
      document.querySelectorAll('.card')[i].style.display = 'block';
    } else {
      document.querySelectorAll('.card')[i].style.display = 'none';
    }
  }
});

searchBtn.addEventListener('click', function () {
  document.dispatchEvent(new Event(render_search));
});