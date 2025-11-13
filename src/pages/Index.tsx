import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Array<{id: string, date: Date, name: string, phone: string}>>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  const services = [
    {
      title: 'Семейная фотосессия',
      price: '5 000 ₽',
      duration: '2 часа',
      description: 'Естественные кадры с близкими людьми',
      icon: 'Users'
    },
    {
      title: 'Индивидуальная съёмка',
      price: '3 500 ₽',
      duration: '1 час',
      description: 'Портфолио или личная фотосессия',
      icon: 'User'
    },
    {
      title: 'Love Story',
      price: '6 000 ₽',
      duration: '3 часа',
      description: 'Романтичная прогулка для двоих',
      icon: 'Heart'
    }
  ];

  const handleBooking = (formData: FormData) => {
    if (!date) {
      toast.error('Выберите дату');
      return;
    }
    
    const newBooking = {
      id: Date.now().toString(),
      date,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string
    };
    
    setBookings([...bookings, newBooking]);
    toast.success('Бронирование создано! Скоро с вами свяжусь');
  };

  const blockDate = () => {
    if (date && !blockedDates.some(d => d.toDateString() === date.toDateString())) {
      setBlockedDates([...blockedDates, date]);
      toast.success('Дата закрыта для бронирования');
    }
  };

  const isDateBlocked = (checkDate: Date) => {
    return blockedDates.some(d => d.toDateString() === checkDate.toDateString());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">FotoStudio</h1>
          <nav className="flex gap-6 items-center">
            <a href="#services" className="text-foreground hover:text-accent transition-colors">Услуги</a>
            <a href="#calendar" className="text-foreground hover:text-accent transition-colors">Записаться</a>
            <a href="#contacts" className="text-foreground hover:text-accent transition-colors">Контакты</a>
            <Button 
              variant={isAdmin ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
            >
              <Icon name={isAdmin ? "Lock" : "Unlock"} size={16} className="mr-2" />
              {isAdmin ? 'Админ' : 'Войти'}
            </Button>
          </nav>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold text-primary mb-6 animate-fade-in">
            Сохраню важные моменты
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Профессиональная фотосъёмка в Москве — естественные эмоции и красивые кадры
          </p>
          <Button size="lg" className="animate-scale-in" asChild>
            <a href="#calendar">
              <Icon name="Calendar" size={20} className="mr-2" />
              Забронировать съёмку
            </a>
          </Button>
        </div>
      </section>

      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-primary mb-12">Услуги</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border animate-fade-in">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Icon name={service.icon} size={32} className="text-accent" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary mb-3 text-center">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 text-center">{service.description}</p>
                  <div className="flex justify-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-sm">
                      <Icon name="Clock" size={14} className="mr-1" />
                      {service.duration}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-accent text-center">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="calendar" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-5xl font-bold text-center text-primary mb-12">Выберите дату</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="p-6 animate-fade-in">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-0 mx-auto"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || isDateBlocked(date);
                }}
              />
              {isAdmin && date && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={blockDate}
                    disabled={isDateBlocked(date)}
                  >
                    <Icon name="Ban" size={16} className="mr-2" />
                    {isDateBlocked(date) ? 'Дата закрыта' : 'Закрыть дату'}
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-8 animate-fade-in">
              <h3 className="text-2xl font-semibold text-primary mb-6">Забронировать</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBooking(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input id="name" name="name" placeholder="Анна" required />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                </div>
                <div>
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea id="comment" name="comment" placeholder="Расскажите о желаемой фотосессии" rows={3} />
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Выбранная дата:</p>
                  <p className="text-lg font-semibold text-primary">
                    {date ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Не выбрана'}
                  </p>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="py-20 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold text-primary">Панель управления</h2>
              <Badge variant="default">Админ</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
                  <Icon name="CalendarCheck" size={24} className="mr-2" />
                  Бронирования ({bookings.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Пока нет бронирований</p>
                  ) : (
                    bookings.map(booking => (
                      <Card key={booking.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-primary">{booking.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.phone}</p>
                            <p className="text-sm text-accent mt-1">
                              {booking.date.toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Icon name="MessageCircle" size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Настроить напоминание</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <p className="text-sm text-muted-foreground">
                                  Клиент: <span className="font-semibold text-foreground">{booking.name}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Дата съёмки: <span className="font-semibold text-foreground">
                                    {booking.date.toLocaleDateString('ru-RU')}
                                  </span>
                                </p>
                                <div>
                                  <Label>Отправить напоминание за:</Label>
                                  <select className="w-full mt-2 p-2 border border-input rounded-md bg-background">
                                    <option>1 день</option>
                                    <option>2 дня</option>
                                    <option>3 дня</option>
                                    <option>1 неделю</option>
                                  </select>
                                </div>
                                <div>
                                  <Label>Текст сообщения:</Label>
                                  <Textarea 
                                    className="mt-2"
                                    defaultValue={`Привет, ${booking.name}! Напоминаю о нашей фотосессии ${booking.date.toLocaleDateString('ru-RU')}. Жду встречи! 📸`}
                                    rows={4}
                                  />
                                </div>
                                <Button className="w-full" onClick={() => toast.success('Напоминание настроено!')}>
                                  <Icon name="Send" size={16} className="mr-2" />
                                  Настроить WhatsApp напоминание
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
                  <Icon name="Ban" size={24} className="mr-2" />
                  Закрытые даты ({blockedDates.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blockedDates.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет закрытых дат</p>
                  ) : (
                    blockedDates.map((date, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                        <span className="text-sm font-medium">
                          {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setBlockedDates(blockedDates.filter((_, i) => i !== idx));
                            toast.success('Дата открыта');
                          }}
                        >
                          <Icon name="Unlock" size={16} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      <section id="contacts" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl font-bold text-primary mb-8">Контакты</h2>
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon name="Phone" size={24} className="text-accent" />
                <a href="tel:+79991234567" className="text-2xl font-semibold text-primary hover:text-accent transition-colors">
                  +7 (999) 123-45-67
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Icon name="Mail" size={24} className="text-accent" />
                <a href="mailto:info@fotostudio.ru" className="text-xl text-muted-foreground hover:text-accent transition-colors">
                  info@fotostudio.ru
                </a>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" size="lg" asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Icon name="Instagram" size={20} className="mr-2" />
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer">
                    <Icon name="Send" size={20} className="mr-2" />
                    Telegram
                  </a>
                </Button>
              </div>
            </Card>
            <p className="text-sm text-muted-foreground">
              г. Москва, ул. Примерная, 123
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 FotoStudio. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
