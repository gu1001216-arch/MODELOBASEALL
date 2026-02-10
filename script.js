// CONFIGURAÇÃO DO GOOGLE SHEETS
// Substitua o ID abaixo se necessário. Atualmente configurado para sua planilha.
const PUB_ID = '2PACX-1vQHDHtJ5vVgrBKIsG4wIupunOEAxWGwyua-BQf0LX60kjCs3ZKm8gC1z_dTQ5sE7Vr8GdnP_1ys7D4k';

const DEFAULT_DATA = {
    config: {
        businessname: 'Seu Negócio (Carregando...)',
        businessdescription: 'Prestador de serviços profissional',
        businessphone: '(11) 99999-9999',
        businessemail: 'contato@seunegocio.com.br',
        businessaddress: 'São Paulo, SP',
        businesslogo: '',
        herotitle: 'Bem-vindo ao nosso site',
        herosubtitle: 'Serviços profissionais de qualidade para você e sua empresa',
        herobuttontext: 'Saiba Mais',
        abouttitle: 'Sobre Nós',
        aboutdescription: 'Somos uma equipe dedicada a oferecer os melhores serviços com excelência e comprometimento.',
        aboutimage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        heroimage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80'
    },
    services: [
        { title: 'Serviço 1', description: 'Descrição detalhada do primeiro serviço.', icon: '🎯' },
        { title: 'Serviço 2', description: 'Descrição detalhada do segundo serviço.', icon: '⭐' },
        { title: 'Serviço 3', description: 'Descrição detalhada do terceiro serviço.', icon: '🚀' }
    ]
};

async function init() {
    console.log("Iniciando carregamento dos dados...");
    let siteData = JSON.parse(JSON.stringify(DEFAULT_DATA));

    try {
        // Tentamos carregar as abas. O Google Sheets publicado como CSV usa GIDs.
        // Aba Config (Geralmente gid=0)
        const configData = await fetchCSV(0);
        if (configData) {
            siteData.config = parseConfig(configData);
            console.log("Configurações carregadas com sucesso.");
        } else {
            console.error("Não foi possível carregar a aba Config. Verifique se publicou como CSV.");
        }

        // Aba Services (Seu GID específico: 1832204562)
        const servicesData = await fetchCSV('1832204562');
        if (servicesData) {
            siteData.services = parseServices(servicesData);
            console.log("Serviços carregados com sucesso.");
        } else {
            console.warn("Aba Services não encontrada. Usando serviços padrão.");
        }
    } catch (error) {
        console.error('Erro crítico na inicialização:', error);
    }

    renderSite(siteData);
    setupEventListeners();
    
    // Remove a tela de carregamento
    const loader = document.getElementById('loading');
    if (loader) loader.classList.add('hidden');
}

async function fetchCSV(gid) {
    // Adicionamos um timestamp para evitar que o navegador ou o Google entreguem uma versão antiga (cache)
    const cacheBuster = new Date().getTime();
    const url = `https://docs.google.com/spreadsheets/d/e/${PUB_ID}/pub?gid=${gid}&output=csv&t=${cacheBuster}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP erro! Status: ${response.status}`);
        }
        const text = await response.text();
        
        // Se o Google retornar HTML em vez de CSV, significa que não foi publicado como CSV
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
            throw new Error("O link retornou HTML. Certifique-se de publicar como 'Valores separados por vírgula (.csv)'.");
        }
        
        return parseCSVToArray(text);
    } catch (e) {
        console.error(`Erro ao buscar dados (GID: ${gid}):`, e.message);
        return null;
    }
}

function parseCSVToArray(text) {
    const lines = text.split(/\r?\n/);
    return lines.map(line => {
        const result = [];
        let cur = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                result.push(cur.trim());
                cur = '';
            } else {
                cur += char;
            }
        }
        result.push(cur.trim());
        return result;
    });
}

function parseConfig(rows) {
    if (!rows || rows.length < 2) return DEFAULT_DATA.config;
    const headers = rows[0].map(h => h.toLowerCase().trim().replace(/^"|"$/g, ''));
    const values = rows[1].map(v => v.trim().replace(/^"|"$/g, ''));
    const config = {};
    headers.forEach((header, i) => {
        if (values[i] !== undefined) config[header] = values[i];
    });
    return { ...DEFAULT_DATA.config, ...config };
}

function parseServices(rows) {
    if (!rows || rows.length < 2) return DEFAULT_DATA.services;
    const headers = rows[0].map(h => h.toLowerCase().trim().replace(/^"|"$/g, ''));
    const services = rows.slice(1).map(row => {
        const item = {};
        headers.forEach((header, i) => {
            item[header] = (row[i] || '').trim().replace(/^"|"$/g, '');
        });
        return item;
    }).filter(s => s.title);
    return services.length > 0 ? services : DEFAULT_DATA.services;
}

function renderSite(data) {
    const { config, services } = data;
    
    // Atualiza textos básicos
    document.title = config.businessname;
    document.getElementById('header-name').textContent = config.businessname;
    document.getElementById('footer-name').textContent = config.businessname;
    document.getElementById('footer-copyright-name').textContent = config.businessname;
    
    // Logo
    const logoImg = document.getElementById('header-logo');
    if (config.businesslogo) {
        logoImg.src = config.businesslogo;
        logoImg.classList.remove('hidden');
    }

    // Hero
    document.getElementById('hero-bg').style.backgroundImage = `url('${config.heroimage || DEFAULT_DATA.config.heroimage}')`;
    document.getElementById('hero-title').textContent = config.herotitle;
    document.getElementById('hero-subtitle').textContent = config.herosubtitle;
    document.getElementById('hero-btn').textContent = config.herobuttontext;

    // Sobre
    document.getElementById('about-image').src = config.aboutimage || DEFAULT_DATA.config.aboutimage;
    document.getElementById('about-title').textContent = config.abouttitle;
    document.getElementById('about-description').textContent = config.aboutdescription;

    // Contato
    document.getElementById('contact-phone').textContent = config.businessphone;
    document.getElementById('contact-email').textContent = config.businessemail;
    document.getElementById('contact-address').textContent = config.businessaddress;
    
    // Footer Links
    document.getElementById('footer-phone-link').textContent = config.businessphone;
    document.getElementById('footer-phone-link').href = `tel:${config.businessphone.replace(/\D/g, '')}`;
    document.getElementById('footer-email-link').textContent = config.businessemail;
    document.getElementById('footer-email-link').href = `mailto:${config.businessemail}`;
    document.getElementById('year').textContent = new Date().getFullYear();

    // WhatsApp
    const waPhone = config.businessphone.replace(/\D/g, '');
    const waMsg = encodeURIComponent(`Olá! Gostaria de saber mais sobre a ${config.businessname}.`);
    document.getElementById('whatsapp-btn').href = `https://wa.me/${waPhone}?text=${waMsg}`;

    // Serviços
    const grid = document.getElementById('services-grid');
    grid.innerHTML = services.map(s => `
        <div class="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-all group">
            <div class="text-4xl mb-6">${s.icon || '🛠️'}</div>
            <h3 class="text-xl font-bold mb-4">${s.title}</h3>
            <p class="text-muted text-sm leading-relaxed mb-6">${s.description}</p>
            <a href="#contact" class="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Saiba mais <span>→</span>
            </a>
        </div>
    `).join('');
}

function setupEventListeners() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.onclick = () => menu.classList.toggle('hidden');
    }
    document.querySelectorAll('.mobile-link').forEach(l => {
        l.onclick = () => menu.classList.add('hidden');
    });
}

// Inicia tudo
window.onload = init;
