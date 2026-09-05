/**
 * typing.js - Dynamic Typewriter Effect for Hero Section
 */

class TypeWriter {
  constructor(element, words, wait = 2500) {
    this.element = element;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.type();
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.element.innerHTML = `<span class="txt">${this.txt}</span><span class="typing-cursor"></span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if (this.isDeleting) {
      typeSpeed /= 2; // Deleting is twice as fast
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing new word
      typeSpeed = 400;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const typingElement = document.querySelector('#typing-text');
  if (typingElement) {
    const words = [
      'Back-end Developer',
      'Sinh Viên CNTT Đam Mê Lập Trình',
      'Problem Solver & Problem Thinker',
      'Software Engineering Aspirant'
    ];
    new TypeWriter(typingElement, words, 2200);
  }
});
