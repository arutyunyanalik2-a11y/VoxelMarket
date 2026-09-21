import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Волны адаптированы для светлого фона
        const waves = [
            { amp: 1.2, freq: 0.0015, speed: 0.012, color: "rgba(0, 50, 255, 0.6)" },  // Синяя
            { amp: 1.6, freq: 0.0010, speed: 0.008, color: "rgba(255, 120, 0, 0.7)" },  // Оранжевая
            // { amp: 1.6, freq: 0.0010, speed: 0.008, color: "rgba(255, 120, 0, 0.7)" },  // Оранжевая
            { amp: 0.9, freq: 0.0020, speed: 0.016, color: "rgba(0, 50, 255, 0.6)" }    // Темно-синяя
        ];

        // Слова для анимации
        const shoppingWords = [
            "Voxel Market", "Быстрая доставка", 
            "Новинки", "Гаджеты",  
            "3D-модели", "3D печать"
        ];
        
        const activeTexts = [];

        class FloatingText {
            constructor() {
                this.text = shoppingWords[Math.floor(Math.random() * shoppingWords.length)];
                // Распределяем текст по всему экрану, оставляя отступы по краям
                this.x = Math.random() * (canvas.width - 200) + 100;
                this.y = Math.random() * (canvas.height - 100) + 50;
                this.opacity = 0;
                this.phase = "in";
                this.holdTimer = 0;
            }

            update() {
                // Плавное движение вверх
                this.y -= 0.3;

                // Управление прозрачностью (появление -> ожидание -> исчезновение)
                if (this.phase === "in") {
                    this.opacity += 0.01;
                    if (this.opacity >= 0.6) this.phase = "hold";
                } else if (this.phase === "hold") {
                    this.holdTimer++;
                    if (this.holdTimer > 150) this.phase = "out";
                } else if (this.phase === "out") {
                    this.opacity -= 0.008;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(100, 110, 130, ${this.opacity})`;
                ctx.font = "600 20px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        const animate = () => {
            // Очищаем белым цветом
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            time += 1;

            // --- ОТРИСОВКА ВСПЛЫВАЮЩИХ СЛОВ ---
            // Добавляем новые слова случайным образом
            if (Math.random() < 0.015 && activeTexts.length < 6) {
                activeTexts.push(new FloatingText());
            }

            for (let i = activeTexts.length - 1; i >= 0; i--) {
                const textObj = activeTexts[i];
                textObj.update();
                textObj.draw();

                // Удаляем объекты, которые полностью исчезли
                if (textObj.phase === "out" && textObj.opacity <= 0) {
                    activeTexts.splice(i, 1);
                }
            }

            // --- ОТРИСОВКА ВОЛН ПОД УГЛОМ ---
            ctx.save();
            // Смещаем центр координат в середину экрана для корректного поворота
            ctx.translate(canvas.width / 2, canvas.height / 2);
            // Поворачиваем холст примерно на -25 градусов
            ctx.rotate(-25 * Math.PI / 180);

            // Так как холст повернут, рисуем линии шире реального экрана, чтобы не было обрывов по краям
            const drawSpan = Math.max(canvas.width, canvas.height) * 1.5;
            const baseAmplitude = canvas.height * 0.15;

            waves.forEach((wave, index) => {
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = wave.color;
                
                // Проходим от отрицательного края к положительному
                for (let x = -drawSpan; x <= drawSpan; x += 5) {
                    const y = Math.sin(x * wave.freq + time * wave.speed + index * 10) * (baseAmplitude * wave.amp)
                            + Math.cos(x * wave.freq * 0.8 - time * wave.speed * 0.5) * (baseAmplitude * 0.4);
                    
                    if (x === -drawSpan) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            });
            ctx.restore();

            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://voxelmarket-backend.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', email);
                if (data.avatar) {
                    localStorage.setItem('userAvatar', data.avatar);
                }
                
                navigate('/profile');
                window.location.reload();
            } else {
                alert(data.message || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Не удалось подключиться к серверу');
        }
    };

    return (
        <div className="login-page" style={{ position: 'relative', overflow: 'hidden', minHeight: '87vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Анимированный Canvas белый фон */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            />

            {/* Карточка авторизации */}
            <div className="login-card" style={{ 
                position: 'relative', 
                zIndex: 1, 
                background: '#ffffff', 
                padding: '40px', 
                borderRadius: '15px', 
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', // Более мягкая тень для светлого дизайна
                border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
                <h1 style={{ color: '#333' }}>Вход в систему</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ color: '#555' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: '#555' }}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Войти</button>

                    <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
                        Нет аккаунта? <Link to="/register" style={{ color: '#007bff' }}>Зарегистрироваться</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}