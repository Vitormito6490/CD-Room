const themeButton = document.getElementById('btn-tema');
const revealElements = document.querySelectorAll('.reveal');
const heroCover = document.getElementById('hero-cover');
const heroCoverNumber = document.getElementById('hero-cover-number');
const heroArt = document.querySelector('.hero-art');
const coverSlides = [
    { src: 'IMGs/lafamila013.jpeg', alt: 'Capa do CD La Familia 013' },
    { src: 'IMGs/camisa10jogabolaatenachuva.jpeg', alt: 'Capa do CD Camisa 10 Joga Bola Até Na Chuva' },
    { src: 'IMGs/ritmoritualeresponsa.jpeg', alt: 'Capa do CD Ritmo, Ritual e Responsa' },
    { src: 'IMGs/imunidademusical.jpeg', alt: 'Capa do CD Imunidade Musical' },
    { src: 'IMGs/tamoainaatividade.jpeg', alt: 'Capa do CD Tamo Aí na Atividade' },
    { src: 'IMGs/acusticomtvcbjr.jpeg', alt: 'Capa do CD Acústico MTV: Charlie Brown Jr.' },
    { src: 'IMGs/bocasordinarias.jpeg', alt: 'Capa do CD Bocas Ordinárias' },
    { src: 'IMGs/100charliebrownjrabalandoasuafabrica.jpeg', alt: 'Capa do CD 100% Charlie Brown Jr.' },
    { src: 'IMGs/nadandocomostubaroes.jpeg', alt: 'Capa do CD Nadando Com Os Tubarões' },
    { src: 'IMGs/precocurtoprazolongo.jpeg', alt: 'Capa do CD Preço Curto, Prazo Longo' },
    { src: 'IMGs/transpiracaocontinuaprolongada.jpeg', alt: 'Capa do CD Transpiração Continua Prolongada' },
    { src: 'IMGs/mtvaovivo.jpeg', alt: 'Capa do CD MTV Ao Vivo' },
    { src: 'IMGs/sonoforevis.jpeg', alt: 'Capa do CD Só No Forevis' },
    { src: 'IMGs/lapadasdopovo.jpeg', alt: 'Capa do CD Lapadas do Povo' },
    { src: 'IMGs/cestabasica.jpeg', alt: 'Capa do CD Cesta Básica' },
    { src: 'IMGs/lavotanovo.jpeg', alt: 'Capa do CD Lavô Tá Novo' },
    { src: 'IMGs/raimundos.jpeg', alt: 'Capa do CD Raimundos' },
    { src: 'IMGs/estreito.jpeg', alt: 'Capa do CD Estreito' },
    { src: 'IMGs/rodox.jpeg', alt: 'Capa do CD Rodox' }
];
let currentCover = 0;
let coverTimer;

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
}

function toggleTheme() {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme();
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.14 });

revealElements.forEach((element) => revealObserver.observe(element));
themeButton.addEventListener('click', toggleTheme);
applyTheme();

function showNextCover() {
    if (!heroCover || !heroCoverNumber) return;

    currentCover = (currentCover + 1) % coverSlides.length;
    const nextCover = coverSlides[currentCover];
    heroCover.classList.remove('is-changing');
    void heroCover.offsetWidth;
    heroCover.src = nextCover.src;
    heroCover.alt = nextCover.alt;
    heroCoverNumber.textContent = `${String(currentCover + 1).padStart(2, '0')} / ${coverSlides.length}`;
    heroCover.classList.add('is-changing');
}

function startCoverCarousel() {
    if (!coverTimer && coverSlides.length > 1) {
        coverTimer = window.setInterval(showNextCover, 3500);
    }
}

function stopCoverCarousel() {
    window.clearInterval(coverTimer);
    coverTimer = undefined;
}

if (heroCover) {
    heroArt.addEventListener('click', showNextCover);
    heroArt.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showNextCover();
        }
    });
    startCoverCarousel();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCoverCarousel();
        } else {
            startCoverCarousel();
        }
    });
}
