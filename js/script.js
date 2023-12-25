const books = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'DICODING_BOOKSHELF_APPS'

document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('add-book')
    const searchBookForm = document.getElementById('search-book')
    addBookForm.addEventListener('submit', (e) => {
      e.preventDefault()
      addBook()
    })

    searchBookForm.addEventListener('submit', (e) => {
      e.preventDefault()
      alert('Not working yet.')
    })

    if(isStorageExist()) {
      loadDataFromStorage()
    }
})

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBookList =  document.getElementById('unfinished-book')
  uncompletedBookList.innerHTML = ''

  const completedBookList = document.getElementById('finished-reading')
  completedBookList.innerHTML = ''

  for(const bookItem of books) {
    const bookElement = makeBook(bookItem)
    if(!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement)
    }
    else {
      completedBookList.append(bookElement)
    }
  }
})

document.addEventListener(SAVED_EVENT, () => {})

const addBook = () => {
  let bookTitle = document.getElementById('title')
  let bookAuthor = document.getElementById('author')
  let bookYear = document.getElementById('year')
  
  const generatedID = generateId()
  const bookObject = generateBookObject(generatedID, bookTitle.value, bookAuthor.value, parseInt(bookYear.value), false)
  books.push(bookObject)
  
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()

  bookTitle.value = ''
  bookAuthor.value = ''
  bookYear.value = ''

  alert('Success to add new book.')
}

const generateId = () => {
  return +new Date()
}
 
const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

const makeBook = (bookObject) => {
  const bookTitle = document.createElement('h2')
  bookTitle.classList.add('font-bold', 'text-xl')
  bookTitle.innerText = bookObject.title

  const bookAuthor = document.createElement('h3')
  bookAuthor.innerText = 'Author: ' + bookObject.author
 
  const year = document.createElement('h3')
  year.innerText = 'Year: ' + bookObject.year
 
  const textContainer = document.createElement('div')
  textContainer.classList.add('inner')
  textContainer.append(bookTitle, bookAuthor, year)
 
  const container = document.createElement('div')
  container.classList.add('item', 'shadow')
  container.append(textContainer)
  container.setAttribute('id', `todo-${bookObject.id}`)
 
  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBook(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });
 
    container.append(undoButton, trashButton);
  } 
  else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });
    
    container.append(checkButton, trashButton);
  }
  return container;
}

const addTaskToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
  alert('The book has been moved to "Finished Reading."')
}

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

const removeBook = (bookId) => {
  const bookTarget = findBookIndex(bookId)

  if(bookTarget === -1) return

  books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  alert('The book has been removed.')
}

const undoBook = (bookId) => {
  const bookTarget = findBook(bookId)

  if(bookTarget == null) return

  bookTarget.isCompleted = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
  alert('The book has been moved to "Unfinished Book."')
}

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index
    }
  }

  return -1
}

const saveData = () => {
  if(isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

const isStorageExist = () => {
  if(typeof (Storage) === undefined) {
    alert('The browser you are using does not support local storage.')
    return false
  }
  return true
}

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if(data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}