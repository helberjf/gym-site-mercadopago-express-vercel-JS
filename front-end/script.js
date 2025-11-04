// JavaScript personalizado para Maquina Team - Responsivo e Otimizado

document.addEventListener('DOMContentLoaded', function() {
    
    // Configurar carrossel para trocar a cada 2.5 segundos
    $('#academiaCarousel').carousel({
        interval: 2500,
        ride: 'carousel'
    });
    
    // Reviews carousel - trocar a cada 2 segundos
    let currentReview = 0;
    const reviews = document.querySelectorAll('.review-item');
    
    function showNextReview() {
        if (reviews.length > 0) {
            reviews[currentReview].classList.remove('active');
            currentReview = (currentReview + 1) % reviews.length;
            reviews[currentReview].classList.add('active');
        }
    }
    
    // Iniciar carrossel de reviews
    if (reviews.length > 0) {
        setInterval(showNextReview, 2000);
    }
    
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Compensar navbar fixa
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
                
                // Atualizar link ativo
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Destacar link ativo na navegação baseado no scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active de todos os links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adiciona active ao link correspondente
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Atualizar link ativo no scroll (com throttling para performance)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });
    
    // Animação de entrada para cards quando entram na viewport
    function animateOnScroll() {
        const cards = document.querySelectorAll('.info-card, .plan-card');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardVisible = 150;
            
            if (cardTop < window.innerHeight - cardVisible && !card.classList.contains('fade-in-up')) {
                card.classList.add('fade-in-up');
            }
        });
    }
    
    // Executar animação no scroll (com throttling)
    let animationTimeout;
    window.addEventListener('scroll', function() {
        if (animationTimeout) {
            clearTimeout(animationTimeout);
        }
        animationTimeout = setTimeout(animateOnScroll, 10);
    });
    animateOnScroll(); // Executar uma vez no carregamento
    
    // Otimização para dispositivos móveis
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reduzir intervalo do carrossel em mobile para economizar bateria
            $('#academiaCarousel').carousel('dispose').carousel({
                interval: 4000,
                ride: 'carousel'
            });
            
            // Desabilitar animações complexas em mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        } else {
            // Restaurar configurações desktop
            $('#academiaCarousel').carousel('dispose').carousel({
                interval: 2500,
                ride: 'carousel'
            });
            
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    }
    
    // Executar otimização inicial
    optimizeForMobile();
    
    // Executar otimização no redimensionamento (com debounce)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(optimizeForMobile, 250);
    });
    
    // Funcionalidade para botões dos planos
    const planButtons = document.querySelectorAll('.btn-plan');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll suave para seção de contatos
            const contactSection = document.querySelector('#contatos');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Destacar seção de contatos
                setTimeout(() => {
                    const contactInfo = document.querySelector('.contact-info');
                    if (contactInfo) {
                        contactInfo.style.animation = 'pulse 1s ease-in-out';
                        setTimeout(() => {
                            contactInfo.style.animation = '';
                        }, 1000);
                    }
                }, 800);
            }
        });
    });
    
    // Adicionar efeito pulse
    const pulseStyles = document.createElement('style');
    pulseStyles.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(pulseStyles);
    
    // Funcionalidade dos botões WhatsApp e Instagram
    const whatsappBtns = document.querySelectorAll('.btn-whatsapp, .btn-whatsapp-large');
    const instagramBtns = document.querySelectorAll('.btn-instagram, .btn-instagram-large');
    
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Analytics ou tracking podem ser adicionados aqui
            console.log('WhatsApp button clicked');
            
            // Adicionar efeito visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    instagramBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Analytics ou tracking podem ser adicionados aqui
            console.log('Instagram button clicked');
            
            // Adicionar efeito visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Lazy loading para imagens (se necessário)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sem suporte ao IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Executar lazy loading se houver imagens com data-src
    if (document.querySelector('img[data-src]')) {
        lazyLoadImages();
    }
    
    // Melhorar acessibilidade
    function improveAccessibility() {
        // Adicionar skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-dark);
            color: var(--accent-gold);
            padding: 8px 12px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
            font-weight: 600;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    improveAccessibility();
    
    // Função para detectar se é página FAQ
    function isFAQPage() {
        return window.location.pathname.includes('faq.html') || document.title.includes('FAQ');
    }
    
    // Configurações específicas para página FAQ
    if (isFAQPage()) {
        // Destacar link FAQ na navegação
        const faqLink = document.querySelector('.nav-link[href="faq.html"]');
        if (faqLink) {
            faqLink.classList.add('active');
        }
        
        // Melhorar acessibilidade dos accordions
        const accordionButtons = document.querySelectorAll('[data-toggle="collapse"]');
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = document.querySelector(this.getAttribute('data-target'));
                if (target) {
                    // Adicionar pequeno delay para a animação do Bootstrap
                    setTimeout(() => {
                        if (target.classList.contains('show')) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }
                    }, 350);
                }
            });
        });
    }
    
    console.log('Maquina Team website loaded successfully with full responsiveness!');
});

// Função para detectar tipo de dispositivo
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 576) return 'mobile';
    if (width < 768) return 'tablet-portrait';
    if (width < 992) return 'tablet-landscape';
    if (width < 1200) return 'desktop-small';
    return 'desktop-large';
}

// Função para otimizar performance baseada no dispositivo
function optimizePerformance() {
    const deviceType = getDeviceType();
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType.includes('tablet');
    
    if (isMobile || isTablet) {
        // Reduzir qualidade de animações em dispositivos móveis
        document.documentElement.style.setProperty('--transition-duration', '0.2s');
        
        // Desabilitar efeitos de parallax em mobile
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            el.style.transform = 'none';
        });
    } else {
        // Restaurar animações completas em desktop
        document.documentElement.style.setProperty('--transition-duration', '0.3s');
    }
}

// Executar otimização no carregamento e redimensionamento
window.addEventListener('load', optimizePerformance);
window.addEventListener('resize', debounce(optimizePerformance, 250));

// Função de debounce para otimizar eventos de resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para mostrar alertas personalizados (se necessário)
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--accent-red)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        border: 2px solid var(--accent-gold);
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Adicionar estilos de animação para alertas
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .custom-alert .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .custom-alert .alert-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    .custom-alert .alert-close:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(alertStyles);

// Payment integration: frontend sends only the plan number (product id) to the backend.
// Backend is authoritative for plan totals (see server-side PLAN_PRICES mapping).
// Replace the placeholder below with your Mercado Pago publishable key before testing in sandbox/production.
const publicKey = 'APP_USR-b2f576ee-745b-454e-af2e-adf3c19a80bf';

function createPreferenceOnBackend(productId) {
    const payload = {
        product_id: productId,
        title: `Plano ${productId.replace('plan_', '')}`,
    };

    return fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Erro ao criar preferência: ${res.status} ${text}`);
        }
        return res.json();
    });
}

function renderMercadoPagoBrick(preferenceId, productId, fallbackUrl) {
        try {
            if (!publicKey || publicKey === 'APP_USR-b2f576ee-745b-454e-af2e-adf3c19a80bfY') {
                console.warn('Mercado Pago public key not configured. Set window.MP_PUBLIC_KEY or a meta[name="mp-public-key"].');
            }
            const mp = new MercadoPago(publicKey);
        const bricksBuilder = mp.bricks();
        // Map product_id to existing container IDs in HTML
        const containerMap = {
            'plan_1': 'mp_brick_monthly_1x',
            'plan_2': 'mp_brick_monthly_2x',
            'plan_3': 'mp_brick_monthly_3x',
            'plan_4': 'mp_brick_semiannual_1x',
            'plan_5': 'mp_brick_semiannual_2x',
            'plan_6': 'mp_brick_semiannual_3x',
            'plan_7': 'mp_brick_annual_1x',
            'plan_8': 'mp_brick_annual_2x',
            'plan_9': 'mp_brick_annual_3x',
            'plan_10': 'mp_brick_full_regular',
            'plan_11': 'mp_brick_full_social'
        };
        const containerId = containerMap[productId];
        const container = containerId ? document.getElementById(containerId) : null;
        if (!container) {
            console.error('Container not found for product_id:', productId);
            return;
        }
        container.innerHTML = '';

        bricksBuilder.create('wallet', containerId, {
            initialization: {
                preferenceId,
            }
        }).then(() => {
            console.log('Mercado Pago brick rendered for product', productId);
        }).catch(err => {
            console.error('Error rendering MP brick', err);
            if (fallbackUrl) {
                container.innerHTML = `<a class="btn btn-outline-primary" href="${fallbackUrl}" target="_blank">Pagar (abrir checkout)</a>`;
            }
        });

    } catch (err) {
        console.error('MP render error', err);
    }
}

// Attach click handlers to payment buttons
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-payment');
    if (!btn) return;
    e.preventDefault();
    const productId = btn.getAttribute('data-product-id');
    if (!productId) {
        showAlert('Plano não identificado', 'error');
        return;
    }

    // Create preference on backend
    createPreferenceOnBackend(productId)
        .then(data => {
            const prefId = data?.preference_id;
            const initPoint = data?.preference_url;
            if (prefId) {
                renderMercadoPagoBrick(prefId, productId, initPoint);
            } else if (initPoint) {
                // fallback redirect to checkout
                window.location.href = initPoint;
            } else {
                showAlert('Não foi possível iniciar o pagamento', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showAlert('Erro ao iniciar pagamento: ' + (err.message || err), 'error');
        });
});
