/**
 * CineVault - Frontend JavaScript
 * Connects UI with REST API (fetch) for CRUD operations on MongoDB
 */

document.addEventListener('DOMContentLoaded', () => {
  // Base API URL
  const API_URL = '/api/movies';

  // DOM Elements
  const movieForm = document.getElementById('movie-form');
  const movieIdInput = document.getElementById('movie-id');
  const titleInput = document.getElementById('title');
  const genreInput = document.getElementById('genre');
  const releaseYearInput = document.getElementById('releaseYear');
  const directorInput = document.getElementById('director');
  const ratingInput = document.getElementById('rating');

  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const navAddBtn = document.getElementById('nav-add-btn');

  const feedbackMessage = document.getElementById('feedback-message');
  const loadingSpinner = document.getElementById('loading-spinner');
  const emptyState = document.getElementById('empty-state');
  const moviesContainer = document.getElementById('movies-container');
  const moviesTbody = document.getElementById('movies-tbody');
  const movieCountBadge = document.getElementById('movie-count-badge');

  // Delete Modal Elements
  const deleteModal = document.getElementById('delete-modal');
  const deleteModalText = document.getElementById('delete-modal-text');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  let movieToDeleteId = null;
  let feedbackTimeout = null;

  // Initialize
  fetchMovies();

  // Event Listeners
  movieForm.addEventListener('submit', handleFormSubmit);
  resetBtn.addEventListener('click', resetForm);
  cancelEditBtn.addEventListener('click', resetForm);
  navAddBtn.addEventListener('click', () => {
    resetForm();
    titleInput.focus();
  });

  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', executeDeleteMovie);

  // Close modal when clicking outside
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  /**
   * Fetch all movies from backend GET /api/movies
   */
  async function fetchMovies() {
    showLoading(true);
    hideFeedback();

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch movies');
      }

      const movies = data.data || [];
      renderMovies(movies);
    } catch (error) {
      console.error('Fetch movies error:', error);
      showFeedback(`Error connecting to database: ${error.message}`, 'error');
      renderMovies([]);
    } finally {
      showLoading(false);
    }
  }

  /**
   * Render movies in the table
   */
  function renderMovies(movies) {
    moviesTbody.innerHTML = '';
    movieCountBadge.textContent = `Total Movies: ${movies.length}`;

    if (movies.length === 0) {
      emptyState.classList.remove('hidden');
      moviesContainer.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    moviesContainer.classList.remove('hidden');

    movies.forEach((movie) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><strong>${escapeHtml(movie.title)}</strong></td>
        <td>${escapeHtml(movie.genre)}</td>
        <td>${escapeHtml(String(movie.releaseYear))}</td>
        <td>${escapeHtml(movie.director)}</td>
        <td><span class="rating-badge">${Number(movie.rating).toFixed(1)} / 10</span></td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-edit" data-id="${movie._id}">Edit</button>
          <button class="btn btn-sm btn-delete" data-id="${movie._id}" data-title="${escapeHtml(movie.title)}">Delete</button>
        </td>
      `;

      // Attach event listeners to buttons
      const editBtn = tr.querySelector('.btn-edit');
      const deleteBtn = tr.querySelector('.btn-delete');

      editBtn.addEventListener('click', () => populateEditForm(movie));
      deleteBtn.addEventListener('click', () => openDeleteModal(movie._id, movie.title));

      moviesTbody.appendChild(tr);
    });
  }

  /**
   * Validate form fields
   */
  function validateForm() {
    let isValid = true;

    // Reset error styles
    clearFieldErrors();

    const title = titleInput.value.trim();
    const genre = genreInput.value.trim();
    const releaseYear = releaseYearInput.value.trim();
    const director = directorInput.value.trim();
    const rating = ratingInput.value.trim();

    if (!title) {
      setFieldError('title', 'Movie title is required');
      isValid = false;
    }

    if (!genre) {
      setFieldError('genre', 'Genre is required');
      isValid = false;
    }

    if (!releaseYear) {
      setFieldError('releaseYear', 'Release year is required');
      isValid = false;
    } else {
      const yearNum = Number(releaseYear);
      if (isNaN(yearNum) || yearNum < 1888 || yearNum > 2100) {
        setFieldError('releaseYear', 'Please enter a valid year (1888 - 2100)');
        isValid = false;
      }
    }

    if (!director) {
      setFieldError('director', 'Director is required');
      isValid = false;
    }

    if (rating === '') {
      setFieldError('rating', 'Rating is required');
      isValid = false;
    } else {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
        setFieldError('rating', 'Rating must be a number between 0 and 10');
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Handle form submission for both Add (POST) and Edit (PUT)
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      showFeedback('Please correct the errors in the form before submitting.', 'error');
      return;
    }

    const isEditing = Boolean(movieIdInput.value);
    const movieId = movieIdInput.value;

    const movieData = {
      title: titleInput.value.trim(),
      genre: genreInput.value.trim(),
      releaseYear: Number(releaseYearInput.value),
      director: directorInput.value.trim(),
      rating: Number(ratingInput.value),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? 'Updating...' : 'Adding...';

    try {
      const url = isEditing ? `${API_URL}/${movieId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Operation failed');
      }

      showFeedback(
        isEditing ? 'Movie successfully updated!' : 'Movie successfully added!',
        'success'
      );

      resetForm();
      fetchMovies();
    } catch (error) {
      console.error('Submit error:', error);
      showFeedback(error.message || 'Network error occurred. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isEditing ? 'Update Movie' : 'Add Movie';
    }
  }

  /**
   * Populate form for editing existing movie
   */
  function populateEditForm(movie) {
    clearFieldErrors();
    movieIdInput.value = movie._id;
    titleInput.value = movie.title;
    genreInput.value = movie.genre;
    releaseYearInput.value = movie.releaseYear;
    directorInput.value = movie.director;
    ratingInput.value = movie.rating;

    formTitle.textContent = 'Edit Movie';
    submitBtn.textContent = 'Update Movie';
    cancelEditBtn.classList.remove('hidden');

    // Scroll to form smoothly
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
    titleInput.focus();
  }

  /**
   * Reset form to default (Add mode)
   */
  function resetForm() {
    movieForm.reset();
    movieIdInput.value = '';
    formTitle.textContent = 'Add New Movie';
    submitBtn.textContent = 'Add Movie';
    cancelEditBtn.classList.add('hidden');
    clearFieldErrors();
  }

  /**
   * Delete modal controls
   */
  function openDeleteModal(id, title) {
    movieToDeleteId = id;
    deleteModalText.textContent = `Are you sure you want to delete "${title}"? This action cannot be undone.`;
    deleteModal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    movieToDeleteId = null;
    deleteModal.classList.add('hidden');
  }

  /**
   * Execute movie deletion via DELETE /api/movies/:id
   */
  async function executeDeleteMovie() {
    if (!movieToDeleteId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = 'Deleting...';

    try {
      const response = await fetch(`${API_URL}/${movieToDeleteId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete movie');
      }

      showFeedback('Movie successfully deleted!', 'success');
      closeDeleteModal();

      // If the movie currently being edited is deleted, reset the form
      if (movieIdInput.value === movieToDeleteId) {
        resetForm();
      }

      fetchMovies();
    } catch (error) {
      console.error('Delete error:', error);
      showFeedback(error.message || 'Failed to delete movie', 'error');
      closeDeleteModal();
    } finally {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.textContent = 'Confirm Delete';
    }
  }

  /**
   * Helper: Show Feedback Message Banner
   */
  function showFeedback(message, type = 'info') {
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }

    feedbackMessage.textContent = message;
    feedbackMessage.className = `alert alert-${type}`;
    feedbackMessage.classList.remove('hidden');

    // Auto dismiss after 5 seconds
    feedbackTimeout = setTimeout(() => {
      hideFeedback();
    }, 5000);
  }

  function hideFeedback() {
    feedbackMessage.classList.add('hidden');
    feedbackMessage.textContent = '';
  }

  /**
   * Helper: Field validation error display
   */
  function setFieldError(fieldId, errorMsg) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if (input) input.classList.add('is-invalid');
    if (errorSpan) errorSpan.textContent = errorMsg;
  }

  function clearFieldErrors() {
    ['title', 'genre', 'releaseYear', 'director', 'rating'].forEach((id) => {
      const input = document.getElementById(id);
      const errorSpan = document.getElementById(`${id}-error`);
      if (input) input.classList.remove('is-invalid');
      if (errorSpan) errorSpan.textContent = '';
    });
  }

  /**
   * Helper: Show/Hide loading spinner
   */
  function showLoading(isLoading) {
    if (isLoading) {
      loadingSpinner.classList.remove('hidden');
    } else {
      loadingSpinner.classList.add('hidden');
    }
  }

  /**
   * Helper: Basic HTML escaping for security
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});

