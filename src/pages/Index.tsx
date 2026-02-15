import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

const HERO_BG = "https://cdn.poehali.dev/projects/2c95a5fb-af37-4442-b02a-84053e249642/files/e3d4e6ea-1987-4556-bc12-50e495a37cdd.jpg";

const SERVER_IP = "matrichapvp";
const VERSIONS = "1.18.2 — 1.21.11";

interface DonateItem {
  name: string;
  price: string;
  color: string;
  emoji: string;
  features: string[];
}

const DONATES: DonateItem[] = [
  {
    name: "VIP",
    price: "20₽",
    color: "from-blue-500 to-cyan-400",
    emoji: "⭐",
    features: ["Префикс [VIP]", "Цветной чат", "3 дома", "Набор инструментов"],
  },
  {
    name: "GOD",
    price: "30₽",
    color: "from-yellow-400 to-orange-500",
    emoji: "👑",
    features: ["Префикс [GOD]", "Полёт в лобби", "5 домов", "Набор алмазной брони", "Доступ к /heal"],
  },
  {
    name: "DRAGON",
    price: "60₽",
    color: "from-purple-500 to-pink-500",
    emoji: "🐉",
    features: ["Префикс [DRAGON]", "Полёт везде", "10 домов", "Набор незеритовой брони", "Доступ к /fly", "Частицы при ходьбе"],
  },
  {
    name: "YT",
    price: "Бесплатно",
    color: "from-red-500 to-red-600",
    emoji: "🎥",
    features: ["Префикс [YT]", "Цветной ник", "Уникальные частицы", "Требуется 100+ подписчиков"],
  },
];

const RULES = [
  "Запрещён читерство и использование модов, дающих преимущество",
  "Уважай других игроков — без оскорблений и токсичности",
  "Запрещена реклама других серверов",
  "Гриферство на чужих территориях запрещено",
  "Дюпы и баги — сообщать администрации",
  "Торговля за реальные деньги между игроками запрещена",
];

const SLOT_ITEMS = ["⭐ VIP", "👑 GOD", "🐉 DRAGON", "🎥 YT", "💎 Ничего", "🍀 VIP", "👑 GOD", "🐉 DRAGON"];

function MiniGame() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const [attempts, setAttempts] = useState(3);

  const spin = useCallback(() => {
    if (spinning || attempts <= 0) return;
    setSpinning(true);
    setResult(null);
    setAttempts((a) => a - 1);

    let tick = 0;
    const interval = setInterval(() => {
      setSlots([
        SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
        SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
        SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
      ]);
      tick++;
      if (tick > 15) {
        clearInterval(interval);
        const finalSlots = [
          SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
          SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
          SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)],
        ];
        setSlots(finalSlots);
        setSpinning(false);

        if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
          setResult(`🎉 Джекпот! Ты выиграл ${finalSlots[0]}!`);
        } else if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2]) {
          setResult("🍀 Почти! Два совпадения!");
        } else {
          const randomDonate = DONATES[Math.floor(Math.random() * DONATES.length)];
          setResult(`${randomDonate.emoji} Тебе выпал: ${randomDonate.name} (показательный)`);
        }
      }
    }, 80);
  }, [spinning, attempts]);

  return (
    <Card className="bg-card/80 backdrop-blur border-border p-6 md:p-8 max-w-md mx-auto">
      <h3 className="font-pixel text-sm md:text-base text-primary text-center mb-6">🎰 Слот-машина</h3>
      <div className="flex justify-center gap-3 mb-6">
        {slots.map((slot, i) => (
          <div
            key={i}
            className={`w-24 h-24 md:w-28 md:h-28 bg-muted rounded-lg flex items-center justify-center text-lg font-pixel border-2 border-border ${spinning ? "animate-shake" : ""}`}
          >
            <span className="text-xs md:text-sm text-center leading-tight">{slot}</span>
          </div>
        ))}
      </div>
      <div className="text-center space-y-3">
        <Button
          onClick={spin}
          disabled={spinning || attempts <= 0}
          className="bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-bold px-8 py-3 text-lg hover:scale-105 transition-transform"
        >
          {spinning ? "Крутится..." : attempts > 0 ? "🎲 Крутить!" : "Попытки кончились"}
        </Button>
        <p className="text-muted-foreground text-sm">Осталось попыток: {attempts}</p>
        {result && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30 animate-scale-in">
            <p className="font-bold text-foreground">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function DevicePreview() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        <Button
          variant={device === "desktop" ? "default" : "outline"}
          onClick={() => setDevice("desktop")}
          className="gap-2"
        >
          <Icon name="Monitor" size={18} /> Компьютер
        </Button>
        <Button
          variant={device === "mobile" ? "default" : "outline"}
          onClick={() => setDevice("mobile")}
          className="gap-2"
        >
          <Icon name="Smartphone" size={18} /> Телефон
        </Button>
      </div>
      <div className="flex justify-center">
        {device === "desktop" ? (
          <div className="device-frame w-full max-w-2xl">
            <div className="bg-[#222] flex items-center gap-2 px-4 py-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-[#333] rounded px-3 py-1 text-xs text-muted-foreground text-center">
                matrichapvp.minecraft.net
              </div>
            </div>
            <img src={HERO_BG} alt="Превью" className="w-full h-48 md:h-64 object-cover" />
            <div className="p-4 text-center">
              <p className="font-pixel text-xs text-primary">MatrichaPVP</p>
              <p className="text-muted-foreground text-xs mt-1">Лучший PVP сервер</p>
            </div>
          </div>
        ) : (
          <div className="device-frame device-frame-mobile">
            <img src={HERO_BG} alt="Превью" className="w-full h-40 object-cover" />
            <div className="p-3 text-center">
              <p className="font-pixel text-[8px] text-primary">MatrichaPVP</p>
              <p className="text-muted-foreground text-[10px] mt-1">Лучший PVP сервер</p>
            </div>
            <div className="flex justify-center pb-3">
              <span className="w-10 h-1 bg-[#555] rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DonateCard({ donate, onBuy }: { donate: DonateItem; onBuy: (name: string) => void }) {
  return (
    <Card className="bg-card/80 backdrop-blur border-border overflow-hidden hover:scale-105 transition-all duration-300 hover:border-primary/50 group">
      <div className={`h-2 bg-gradient-to-r ${donate.color}`} />
      <div className="p-5 md:p-6 space-y-4">
        <div className="text-center">
          <span className="text-4xl">{donate.emoji}</span>
          <h3 className="font-pixel text-sm md:text-base mt-3 text-foreground">{donate.name}</h3>
          <p className={`text-2xl font-bold mt-2 bg-gradient-to-r ${donate.color} bg-clip-text text-transparent`}>
            {donate.price}
          </p>
        </div>
        <ul className="space-y-2">
          {donate.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => onBuy(donate.name)}
          className={`w-full bg-gradient-to-r ${donate.color} text-white font-bold hover:opacity-90 transition-opacity`}
        >
          {donate.price === "Бесплатно" ? "Получить" : "Купить"}
        </Button>
      </div>
    </Card>
  );
}

function CopyIP() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg transition-colors group"
    >
      <span className="font-pixel text-xs md:text-sm text-primary">{SERVER_IP}</span>
      <Icon name={copied ? "Check" : "Copy"} size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
      {copied && <span className="text-xs text-primary">Скопировано!</span>}
    </button>
  );
}

const Index = () => {
  const [buyDialog, setBuyDialog] = useState(false);
  const [selectedDonate, setSelectedDonate] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleBuy = (name: string) => {
    setSelectedDonate(name);
    setNickname("");
    setSubmitted(false);
    setBuyDialog(true);
  };

  const handleSubmit = () => {
    if (nickname.trim().length >= 3) {
      setSubmitted(true);
    }
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    ["home", "donates", "minigame", "about", "rules", "contacts"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "donates", label: "Донаты", icon: "Crown" },
    { id: "minigame", label: "Минигра", icon: "Gamepad2" },
    { id: "about", label: "О сервере", icon: "Info" },
    { id: "rules", label: "Правила", icon: "BookOpen" },
    { id: "contacts", label: "Контакты", icon: "Mail" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-pixel text-[10px] md:text-xs text-primary">MatrichaPVP</span>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <CopyIP />
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                activeSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="text-[9px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative z-10 text-center px-4 space-y-6 animate-fade-in">
          <div className="animate-float">
            <span className="text-6xl md:text-8xl">⚔️</span>
          </div>
          <h1 className="font-pixel text-2xl md:text-4xl text-primary drop-shadow-lg">
            MatrichaPVP
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-lg mx-auto">
            Лучший PVP сервер Minecraft с уникальными донатами и минииграми!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => scrollTo("donates")}
              className="bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-bold px-8 py-6 text-lg animate-glow-pulse hover:scale-105 transition-transform"
            >
              <Icon name="Crown" size={20} className="mr-2" /> Донаты
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollTo("minigame")}
              className="px-8 py-6 text-lg border-primary/50 text-primary hover:bg-primary/10"
            >
              <Icon name="Gamepad2" size={20} className="mr-2" /> Минигра
            </Button>
          </div>
          <div className="pt-4">
            <CopyIP />
          </div>
        </div>
      </section>

      <section id="donates" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg md:text-2xl text-primary mb-3">👑 Донаты</h2>
            <p className="text-muted-foreground">Выбери свой статус на сервере</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DONATES.map((d) => (
              <DonateCard key={d.name} donate={d} onBuy={handleBuy} />
            ))}
          </div>
        </div>
      </section>

      <section id="minigame" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg md:text-2xl text-accent mb-3">🎮 Минигра</h2>
            <p className="text-muted-foreground">Крути слоты и выигрывай случайный донат!</p>
          </div>
          <MiniGame />
        </div>
      </section>

      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg md:text-2xl text-secondary mb-3">🏰 О сервере</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/80 backdrop-blur border-border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚔️</span>
                <div>
                  <h3 className="font-bold text-foreground">PVP арены</h3>
                  <p className="text-sm text-muted-foreground">Сражайся с другими игроками</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏗️</span>
                <div>
                  <h3 className="font-bold text-foreground">Режим выживания</h3>
                  <p className="text-sm text-muted-foreground">Строй, добывай, развивайся</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="font-bold text-foreground">Мини-игры</h3>
                  <p className="text-sm text-muted-foreground">BedWars, SkyWars и другие</p>
                </div>
              </div>
            </Card>
            <div className="space-y-4">
              <DevicePreview />
            </div>
          </div>
        </div>
      </section>

      <section id="rules" className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg md:text-2xl text-destructive mb-3">📜 Правила</h2>
            <p className="text-muted-foreground">Соблюдай правила — играй честно!</p>
          </div>
          <div className="space-y-3">
            {RULES.map((rule, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur border-border p-4 flex items-start gap-3 hover:border-destructive/30 transition-colors">
                <span className="font-pixel text-xs text-destructive mt-0.5">{i + 1}.</span>
                <p className="text-foreground text-sm md:text-base">{rule}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-pixel text-lg md:text-2xl text-primary mb-3">📬 Контакты</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-card/80 backdrop-blur border-border p-6 hover:border-primary/50 transition-colors">
              <span className="text-3xl">💬</span>
              <h3 className="font-bold mt-3 text-foreground">Discord</h3>
              <p className="text-sm text-muted-foreground mt-1">MatrichaPVP</p>
            </Card>
            <Card className="bg-card/80 backdrop-blur border-border p-6 hover:border-primary/50 transition-colors">
              <span className="text-3xl">📱</span>
              <h3 className="font-bold mt-3 text-foreground">Telegram</h3>
              <p className="text-sm text-muted-foreground mt-1">@matrichapvp</p>
            </Card>
            <Card className="bg-card/80 backdrop-blur border-border p-6 hover:border-primary/50 transition-colors">
              <span className="text-3xl">🎥</span>
              <h3 className="font-bold mt-3 text-foreground">YouTube</h3>
              <p className="text-sm text-muted-foreground mt-1">MatrichaPVP</p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <p className="font-pixel text-[10px] text-primary">MatrichaPVP</p>
          <p className="text-sm text-muted-foreground">
            IP: <span className="text-primary font-bold">{SERVER_IP}</span>
          </p>
          <div className="inline-block bg-muted px-4 py-2 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Поддерживаемые версии: <span className="text-foreground font-bold">{VERSIONS}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MatrichaPVP. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={buyDialog} onOpenChange={setBuyDialog}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-pixel text-sm text-primary text-center">
              {selectedDonate === "YT" ? "Получить" : "Купить"} {selectedDonate}
            </DialogTitle>
          </DialogHeader>
          {!submitted ? (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Введи свой игровой ник:</label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Твой ник в Minecraft"
                  className="bg-muted border-border text-foreground"
                />
              </div>
              {nickname.length > 0 && nickname.length < 3 && (
                <p className="text-destructive text-xs">Ник должен быть минимум 3 символа</p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={nickname.trim().length < 3}
                className="w-full bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-bold"
              >
                {selectedDonate === "YT" ? "Отправить заявку" : "Перейти к оплате"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3 animate-scale-in">
              <span className="text-5xl">✅</span>
              <p className="font-bold text-foreground">Заявка отправлена!</p>
              <p className="text-sm text-muted-foreground">
                Ник: <span className="text-primary font-bold">{nickname}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Донат: <span className="text-accent font-bold">{selectedDonate}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Свяжитесь с администрацией для завершения оплаты
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;