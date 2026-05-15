    particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#4a90e2' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#4a90e2', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: true }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalContent.textContent = button.getAttribute('data-details');
            modal.classList.remove('hidden');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});