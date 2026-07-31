/*==================================================
THE SCHOLARS
Premium App v3.0
app.js
Enhanced: inline search dropdown, keyboard navigation, accessibility
==================================================*/

// --- (Preserve existing variables and helper functions above this block)

// SEARCH DROPDOWN (replaces previous simple input handler)
if (searchInput) {
  // Create the dropdown container inside the .ts-search container (runtime only)
  const searchWrapper = document.querySelector('.ts-search') || searchInput.parentElement;
  const searchResults = document.createElement('div');
  searchResults.className = 'ts-search-results hidden';
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-expanded', 'false');
  if (searchWrapper) searchWrapper.appendChild(searchResults);

  // current focused result index for keyboard nav
  let focusedIndex = -1;

  // render dropdown
  function renderSearchDropdown(list) {
    if (!searchResults) return;
    if (!list || list.length === 0) {
      searchResults.innerHTML = `<div class="ts-empty" role="option">No results</div>`;
      searchResults.classList.remove('hidden');
      searchResults.setAttribute('aria-expanded', 'true');
      focusedIndex = -1;
      return;
    }

    // show up to 10 results
    const items = list.slice(0, 10).map((resource, i) => {
      const title = escapeHTML(resource.title || 'Untitled');
      const type = escapeHTML(resource.resource_type || '');
      const subject = escapeHTML(resource.subject || '');
      const chapter = escapeHTML(resource.chapter || '');
      const klass = escapeHTML(resource.class || '');
      const pdfUrl = escapeHTML(resource.pdf_url || '#');

      return `
        <div class="ts-search-result-item" role="option" tabindex="-1" data-index="${i}" data-pdf="${pdfUrl}">
          <div class="ts-search-result-icon" aria-hidden="true"></div>
          <div style="min-width:0">
            <div class="ts-search-result-title">${title}</div>
            <div class="ts-search-result-sub">${type}${subject ? ' • ' + subject : ''}${chapter ? ' • ' + chapter : ''}</div>
          </div>
          <div class="ts-search-result-meta">${klass}</div>
        </div>
      `;
    }).join('');

    searchResults.innerHTML = items;
    searchResults.classList.remove('hidden');
    searchResults.setAttribute('aria-expanded', 'true');
    focusedIndex = -1;

    // attach handlers
    const nodes = Array.from(searchResults.querySelectorAll('.ts-search-result-item'));
    nodes.forEach((el) => {
      el.addEventListener('click', () => {
        const pdf = el.getAttribute('data-pdf');
        if (pdf && pdf !== '#') {
          openProtectedResource(pdf);
        }
      });
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') ev.target.click();
      });
    });
  }

  function closeSearchDropdown() {
    if (!searchResults) return;
    searchResults.classList.add('hidden');
    searchResults.setAttribute('aria-expanded', 'false');
    focusedIndex = -1;
    try { searchInput.focus(); } catch (e) {}
  }

  // move focus visually and via tabindex for keyboard nav
  function focusResult(idx) {
    const nodes = searchResults.querySelectorAll('.ts-search-result-item');
    if (!nodes || nodes.length === 0) return;
    if (idx < 0) idx = 0;
    if (idx >= nodes.length) idx = nodes.length - 1;
    nodes.forEach(n => n.setAttribute('tabindex', '-1'));
    const node = nodes[idx];
    node.setAttribute('tabindex', '0');
    node.focus();
    focusedIndex = idx;
  }

  // input handler: show dropdown + update grid
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase().trim();

    if (keyword === '') {
      // show full grid and hide dropdown
      displayResources(allResources);
      closeSearchDropdown();
      return;
    }

    const filtered = allResources.filter(resource => {
      const t = (resource.title || '').toLowerCase();
      const d = (resource.description || '').toLowerCase();
      const s = (resource.subject || '').toLowerCase();
      const c = (resource.chapter || '').toLowerCase();
      const r = (resource.resource_type || '').toLowerCase();
      return t.includes(keyword) || d.includes(keyword) || s.includes(keyword) || c.includes(keyword) || r.includes(keyword);
    });

    // render dropdown and update main grid
    renderSearchDropdown(filtered);
    displayResources(filtered);
  });

  // keyboard navigation on input (Up/Down/Escape)
  searchInput.addEventListener('keydown', (e) => {
    const nodes = searchResults.querySelectorAll('.ts-search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (nodes.length === 0) return;
      focusResult((focusedIndex === -1) ? 0 : Math.min(focusedIndex + 1, nodes.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (nodes.length === 0) return;
      focusResult((focusedIndex === -1) ? nodes.length - 1 : Math.max(focusedIndex - 1, 0));
    } else if (e.key === 'Escape') {
      closeSearchDropdown();
    }
  });

  // closing on outside click + global Escape
  document.addEventListener('click', (e) => {
    if (!searchWrapper) return;
    if (!searchWrapper.contains(e.target)) closeSearchDropdown();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearchDropdown();
  });
}
