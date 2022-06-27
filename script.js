const listBooks = [];
const render_event = 'render-book-item';

document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addBookItem();
  });
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
  cardBody.classList.add('card-body')
  action.classList.add('action');
  action.append(switchBtn, deleteBtn);
  cardBody.append(titleBookElement, authorBookElement, yearOfBookElement, isCompleteBookStatus, action);
  card.append(cardBody);

  if (isComplete) {
    isCompleteBookStatus.innerText = 'Status : Selesai dibaca';
    switchBtn.innerText = 'Belum selesai dibaca';
    switchBtn.classList.add('btn', 'btn-primary', 'mt-4');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = false;
      document.dispatchEvent(new Event(render_event));
    });
  } else {
    isCompleteBookStatus.innerText = 'Status : Belum selesai dibaca';
    switchBtn.innerText = 'Selesai dibaca';
    switchBtn.classList.add('btn', 'btn-success', 'mt-4');
    switchBtn.addEventListener('click', function () {
      const bookItemTarget = searchBookItem(id);
      if (bookItemTarget == null) return;

      bookItemTarget.isComplete = true;
      document.dispatchEvent(new Event(render_event));
    });
  }

  deleteBtn.classList.add('btn', 'btn-danger', 'mt-4', 'ms-2');
  deleteBtn.innerText = 'Hapus data buku';
  deleteBtn.addEventListener('click', function () {
    const bookItemIndex = searchBookIndex(id);
    if (bookItemIndex == -1) return;

    listBooks.splice(bookItemIndex, 1);
    document.dispatchEvent(new Event(render_event));
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