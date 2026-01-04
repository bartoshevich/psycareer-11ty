---
layout: post
title: "Как настроить локальный AI-ассистент"
name: "Локальный AI-ассистент для поддержки при депрессии: от идеи до работающей системы"
description: "Пошаговая инструкция для психологов: как установить приватный AI-чат-бот на базе Ollama для поддержки клиентов с депрессией. Без технических знаний."
date: 2026-01-04
last_modified_at: 2026-01-04
image: /assets/images/articles/lokalnyj-ai-assistent-podderzhka-depressiya/tizer.webp
currentUrl: "/articles/lokalnyj-ai-assistent-podderzhka-depressiya/"
tags: ["psy-идеи"]
permalink: "{{ currentUrl }}"
hasFAQ: true
faqItems:
  - question: "Можно ли использовать на Windows?"
    answer: >
      Да. Процесс установки: 1) Скачайте Ollama для Windows с официального сайта 2) Запустите установщик 3) Откройте PowerShell или Command Prompt 4) Выполните: ollama pull llama3.1:8b 5) Создайте Modelfile (аналогично Linux-инструкции)
  - question: "Нужна ли видеокарта (GPU)?"
    answer: >
      Не обязательно, но желательно. Без GPU (только CPU): Llama 3.1 8B работает со скоростью ~15-20 токенов/сек (ответ за 10-20 сек). С NVIDIA GPU (8GB+ VRAM): Скорость возрастает в 5-10 раз (~100-200 токенов/сек, почти мгновенно). Для базового использования (чек-ины, декомпозиция) CPU достаточно.
  - question: "Как клиент может сохранить историю диалогов?"
    answer: >
      Вручную. Варианты: Простой (копипаст): После важного диалога скопировать вывод терминала и вставить в текстовый файл. Автоматический (для продвинутых): ollama run depression-support | tee ~/mental-health-log-$(date +%Y-%m-%d).txt. НО: Для большинства клиентов с депрессией ручное сохранение — избыточная когнитивная нагрузка. Лучше не сохранять вообще.
  - question: "Что делать, если клиент жалуется на медленные ответы?"
    answer: >
      Три варианта: 1) Использовать меньшую модель: ollama pull mistral:7b-instruct (быстрее Llama 3.1 8B, но чуть ниже качество) 2) Купить GPU: NVIDIA RTX 3060 (12GB) или выше — скорость возрастёт в 10 раз 3) Вернуться к облаку: Claude/ChatGPT с защитами (обезличивание, удаление через 30 дней)
  - question: "Безопасно ли это с точки зрения данных?"
    answer: >
      При локальной установке: Данные НЕ отправляются в интернет, модель работает полностью офлайн, история хранится только на компьютере клиента, можно удалить всё: rm -rf ~/.ollama. НО: Компьютер клиента должен быть защищён: пароль на вход, шифрование диска (FileVault на macOS, LUKS на Linux), антивирус.
  - question: "Можно ли использовать другие модели?"
    answer: >
      Да. Альтернативы Llama 3.1: Mistral 7B (быстрее, чуть менее эмпатична), Gemma 2 (9B) от Google (хороший русский), Phi-3 Medium (14B) качественнее, но медленнее. Команда для установки: ollama pull mistral:7b-instruct; ollama create my-model -f ~/modelfile
hasHowTo: true
howTo:
  name: "Как настроить локальный AI-ассистент для поддержки при депрессии"
  description: "Пошаговая инструкция по установке и настройке приватного AI-чат-бота на базе Ollama"
  totalTime: "PT1H"
  steps:
    - name: "Установка Ollama"
      text: "Откройте терминал и выполните команду: curl -fsSL https://ollama.com/install.sh | sh"
    - name: "Запуск сервиса"
      text: "Запустите Ollama как сервис: sudo systemctl start ollama && sudo systemctl enable ollama"
    - name: "Загрузка AI-модели"
      text: "Загрузите модель Llama 3.1: ollama pull llama3.1:8b"
    - name: "Первый тест"
      text: "Запустите модель и протестируйте: ollama run llama3.1:8b"
    - name: "Кастомизация под депрессию"
      text: "Создайте файл конфигурации с промптом для поддержки при депрессии и создайте кастомную модель"
breadcrumb:
  - { name: "Главная", url: "/" }
  - { name: "Статьи", url: "/articles/" }
---



<p class="basic">Вы — психолог или психотерапевт, работающий с клиентами в состоянии депрессии. Вы понимаете потенциал AI для поддержки между сессиями, но сталкиваетесь с серьезными барьерами:</p>

<ul class="row-gap--xs list--leftpadding">
    <li><strong>Конфиденциальность:</strong> опасаетесь утечек данных в облачных сервисах (ChatGPT, Claude).</li>
    <li><strong>Границы терапии:</strong> хотите дать инструмент поддержки, который не заменит живую работу.</li>
    <li><strong>Технический порог:</strong> не обладаете навыками программирования, но готовы выделить время на настройку.</li>
</ul>



<p class="italic mb-2"><strong>Важно:</strong> AI-ассистент НЕ заменяет терапию. Он дополняет вашу работу, предоставляя клиенту структурированную поддержку 24/7.</p>

<nav class="toc">
  <h2 class="toc__title">Содержание</h2>
  <ol class="toc__list">
    <li><a href="#risk-assessment">Оценка рисков: облако vs локальное решение</a></li>
    <li><a href="#tech-requirements">Технические требования</a></li>
    <li><a href="#installation">Пошаговая установка (Linux/macOS)</a></li>
    <li><a href="#client-instructions">Инструкция для клиента</a></li>
    <li><a href="#boundaries">Границы и супервизия</a></li>
    <li><a href="#faq">Часто задаваемые вопросы</a></li>
    <li><a href="#checklist">Чеклист для внедрения</a></li>
  </ol>
</nav>

<section class="row-gap--m mb-2" id="risk-assessment">
<h2 class="h2">1) Оценка рисков: облако vs&nbsp;локальное решение</h2>

<section class="row-gap--m mb-1">
<h3 class="h3">Облачные AI-сервисы (ChatGPT, Claude)</h3>
<div class="row-gap--xs">
<p><strong>Плюсы</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Работают «из&nbsp;коробки» (5&nbsp;минут на&nbsp;регистрацию).</li>
	<li>Высокое качество ответов.</li>
	<li>Доступны с&nbsp;любого устройства (телефон, планшет, компьютер).</li>
	<li>Быстрые ответы.</li>
 </ul>
 </div>
<div class="row-gap--xs">
<p><strong>Риски</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Деанонимизация при утечке данных.</li>
	<li>Псевдотерапевтическая зависимость.</li>
	<li>Фиксация идентичности «я = болезнь».</li>
	<li>Концентрация данных о человеке в одном месте.</li>
 </ul>
</div>  
<div class="row-gap--xs">
<p><strong>Вывод</strong></p>
<p>Облачные сервисы подходят, если клиент:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Понимает и&nbsp;принимает риски.</li>
	<li>Способен поддерживать защитные практики (обезличивание, удаление).</li>
	<li>Приоритизирует удобство над максимальной приватностью.</li>
 </ul>
</div>
</section>

<section class="row-gap--m mb-1">
<h3 class="h3">Локальное решение (Ollama)</h3>
<div class="row-gap--xs">
<p><strong>Плюсы</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Максимальная приватность (данные не&nbsp;покидают компьютер)</li>
	<li>Полный контроль (можно удалить всё локально)</li>
	<li>Бесплатно после установки</li>
	<li>Нет зависимости от&nbsp;интернета</li>
 </ul>
 </div>
<div class="row-gap--xs">
<p><strong>Минусы</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Сложная установка (<span class="noperenos">1-2</span> часа для новичка)</li>
	<li>Медленнее облака (<span class="noperenos">10-20</span> секунд на&nbsp;ответ vs&nbsp;мгновенно)</li>
	<li>Работает только на&nbsp;компьютере (не&nbsp;на&nbsp;телефоне)</li>
	<li>Ниже качество (локальная модель ≠ Claude/GPT-5)</li>
	<li>Нет автоматического сохранения истории</li>
 </ul>
 </div>
<div class="row-gap--xs">
<p><strong>Вывод</strong></p>
<p> Локальное решение подходит, если клиент:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Параноидально относится к&nbsp;приватности</li>
	<li>Имеет компьютер (желательно 16GB+ RAM)</li>
	<li>Готов к&nbsp;техническим сложностям</li>
	<li>Может терпеть медленные ответы</li>
 </ul>
</div>


</section>
</section>


<section class="row-gap--m mb-2" id="tech-requirements">
<h2 class="h2">2) Технические требования</h2>

<section class="row-gap--m mb-1">
<h3 class="h3">Минимальная конфигурация</h3>
<p><strong>Компьютер:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li><strong>ОС:</strong> Linux (Ubuntu, Fedora), macOS, или Windows 10/11</li>
	<li><strong>RAM:</strong> 16GB минимум, <strong>32GB рекомендуется</strong></li>
	<li><strong>Процессор:</strong> Любой современный (Intel Core i5/i7, AMD Ryzen 5/7)</li>
	<li><strong>Свободное место:</strong> 20GB</li>
	<li><strong>GPU:</strong> Не&nbsp;обязательна (но&nbsp;NVIDIA GPU ускорит в&nbsp;<nobr>5-10 раз)</nobr></li>
 </ul>
<p><strong>Почему 32GB RAM?</strong> Модели AI&nbsp;загружаются в&nbsp;оперативную память. Модель на&nbsp;8&nbsp;миллиардов параметров (оптимальная для CPU) занимает ~10-12GB. С&nbsp;32GB остаётся место для системы и&nbsp;браузера.</p>
</section>
<section class="row-gap--m mb-1">
<h3 class="h3">Что НЕ&nbsp;подходит</h3>
<p>❌ Старые ноутбуки (8GB RAM)<br/>
 ❌ Планшеты и&nbsp;телефоны<br/>
 ❌ Chromebook<br/>
 ❌ Очень старые компьютеры (&gt;7&nbsp;лет) 
</p>
</section>

</section>




<section class="row-gap--m mb-2" id="installation">
<h2 class="h2">3) Пошаговая установка (Linux/macOS)</h2>



<section class="row-gap--m mb-1">
<h3 class="h3">Шаг&nbsp;1. Установка Ollama</h3>
<div class="row-gap--xs">
<p><strong>Linux (Ubuntu/Fedora):</strong></p>
<pre class="language-terminal"><code># Откройте терминал (Ctrl+Alt+T)
# Выполните:
curl -fsSL https://ollama.com/install.sh | sh
# Подождите завершения (~2 минуты)
</code></pre>
</div>
<div class="row-gap--xs">
<p><strong>macOS:</strong></p>
<pre class="language-terminal"><code># Откройте Terminal
# Выполните ту же команду:
curl -fsSL https://ollama.com/install.sh | sh
</code></pre>
</div>
<div class="row-gap--xs">
<p><strong>Проверка:</strong></p>
<pre class="language-terminal"><code>ollama --version
# Должно показать: ollama version is X.X.X
</code></pre>
</div>
<div class="row-gap--xs">
<p><strong>Если ошибка «command not found»:</strong></p>
<pre class="language-terminal"><code># Добавьте в PATH (Linux/macOS):
echo 'export PATH="/usr/local/bin:$PATH"' &gt;&gt; ~/.bashrc
source ~/.bashrc
</code></pre>
</div>
</section>


<section class="row-gap--m mb-1">
<h3 class="h3">Шаг&nbsp;2. Запуск сервиса</h3>
<div class="row-gap--xs">
<p><strong>Linux:</strong></p>
<pre class="language-terminal"><code># Запустить Ollama как сервис
sudo systemctl start ollama
sudo systemctl enable ollama
# Проверка
sudo systemctl status ollama
# Должно быть: Active: active (running)
</code></pre>
</div>
<div class="row-gap--xs">
<p><strong>Возможная ошибка: «permission denied»</strong></p>
<p>Если видите ошибку <code>mkdir /usr/share/ollama: permission denied</code>:</p>
<pre class="language-terminal"><code># Создайте директорию с правами
sudo mkdir -p /usr/share/ollama/.ollama/models
sudo chown -R ollama:ollama /usr/share/ollama
# Перезапустите
sudo systemctl restart ollama
</code></pre>
</div>
<div class="row-gap--xs">
<p><strong>macOS:</strong></p>
<p>Ollama запускается автоматически, дополнительные действия не&nbsp;нужны.</p>
</div>
</section>



<section class="row-gap--m mb-1">
<h3 class="h3">Шаг&nbsp;3. Загрузка AI-модели</h3>
<div class="row-gap--xs">
<p><strong>Рекомендуемая модель: Llama&nbsp;3.1 (8B&nbsp;параметров)</strong></p>
<p>Почему именно она:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Оптимальная для CPU (быстрая на&nbsp;обычных компьютерах)</li>
	<li>Хорошее качество русского языка</li>
	<li>Длинный контекст (128K токенов = недели переписки)</li>
 </ul>
<pre class="language-terminal"><code># Загрузить модель
ollama pull llama3.1:8b
# Подождите 5-7 минут (загружается ~4.7GB)
</code>
</pre>
</div>
<div class="row-gap--xs">
<p><strong>Проверка:</strong></p>
<pre class="language-terminal"><code># Список установленных моделей
ollama list
# Должно показать:
# NAME              ID              SIZE      MODIFIED
# llama3.1:8b       abc123...       4.7 GB    X minutes ago
</code>
</pre>
</div>
</section>


<section class="row-gap--m mb-1">

<h3 class="h3">Шаг&nbsp;4. Первый тест </h3>
<div class="row-gap--xs">
<pre class="language-terminal"><code># Запустить модель
ollama run llama3.1:8b
# Появится приглашение:
&gt;&gt;&gt; 
# Напишите:
&gt;&gt;&gt; Привет! Ты работаешь?
# Модель должна ответить за 5-10 секунд
# Для выхода:
&gt;&gt;&gt; /bye
</code>
</pre>
</div>
<div class="row-gap--xs">
<p>Если ответ получен → установка успешна! Переходите к&nbsp;Шагу&nbsp;5.</p>
</div>
</section>



<section class="row-gap--m mb-1">
<h3>Шаг&nbsp;5. Кастомизация под поддержку при депрессии (15&nbsp;минут)</h3>
<p>Базовая модель Llama&nbsp;3.1&nbsp;— универсальная. Нам нужно адаптировать её&nbsp;под специфику работы с&nbsp;депрессией.</p>
<div class="row-gap--xs">
<p>Создайте файл конфигурации:</p>
<pre class="language-terminal"><code>nano ~/depression-support-modelfile
</code>
</pre>
<p>Вставьте следующее содержимое:</p>
<pre class="language-terminal modelfile-code"><code>
FROM llama3.1:8b

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1

SYSTEM """Ты — ИИ-помощник для людей с депрессией и тревожными расстройствами.

=== ПРИНЦИПЫ ===

1 ВАЛИДАЦИЯ > МОТИВАЦИЯ
Правильно: "Это тяжело" / "Вижу, что вы устали"
Неправильно: "Справишься!" / "Будет хорошо!" / "Не переживай"

2 ДЕКОМПОЗИЦИЯ
Любая задача → шаги ≤5 минут, только первые 3 шага
Пример: НЕ "написать отчёт" → А "открыть документ (30с) → заголовок (2м) → предложение (2м)"

3 "ДОСТАТОЧНО" > "ИДЕАЛЬНО"
Минимальные версии. НЕ "дневник настроения" → А "цифра 1-10"

4 РЕФРЕЙМИНГ
"Я ленивый" → "Исполнительная дисфункция — симптом депрессии"
"Я слабый" → "Вы живёте с хроническим заболеванием"

5 ПАТТЕРНЫ
Видишь повторение → указывай. "Третья система. Может, слишком сложны?"

=== ФОРМАТ ===

Короткие абзацы (2-3 предложения) | Таблицы, списки | БЕЗ эмодзи | БЕЗ воды

=== СЦЕНАРИИ ===

ЧЕК-ИН
User: Настроение 4/10
Response: Спасибо. 4/10 — ниже среднего. Что повлияло? (опционально)

ПАРАЛИЧ
User: Не могу начать [задача]
Response: Микрошаги: 1.[≤5м] 2.[≤5м] 3.[≤5м]. Только шаг 1. Остановка = успех.

САМООБВИНЕНИЕ
User: Я [плохой]
Response: Вы: "[повтор]" | Депрессия: "[повтор]" | Объективно: "[рефрейминг]"
Что бы вы сказали другу?

=== ГРАНИЦЫ ===

НЕ терапевт | НЕ психиатр | Суицид → психиатр немедленно
Не советуй препараты | Каждые 15 сообщений: "Я ИИ. Обсудите наши диалоги с терапевтом"

=== СТИЛЬ ===

Прямой | Честный | Структурированный | Без токсичного позитива

ЯЗЫК: Русский"""
</code>
</pre>


<p>Сохраните: Ctrl+O, Enter, Ctrl+X</p>
</div>
<div class="row-gap--xs">
<p>Создайте кастомную модель:</p>
<pre class="language-terminal"><code>ollama create depression-support -f ~/depression-support-modelfile
# Должно показать:
# transferring model data
# creating new layer
# writing manifest
# success
</code>
</pre>
</div>
<div class="row-gap--xs">
<p>Тестирование кастомной модели:</p>
<pre class="language-terminal"><code>ollama run depression-support
&gt;&gt;&gt; Привет. Это мой первый чек-ин. Настроение 3/10. Очень тяжёлый день.
# Оцените ответ:
# - Есть ли валидация?
# - Нет ли токсичного позитива?
# - Структурирован ли ответ?
&gt;&gt;&gt; /bye
</code>
</pre>
</div>
</section>


<section class="row-gap--m mb-2" id="client-instructions">
<h2 class="h2">4) Инструкция для клиента</h2>
<p>Дайте клиенту следующую инструкцию.</p>

<section class="row-gap--m mb-1">
<h3 class="h3">Базовое использование</h3>
<div class="row-gap--xs">
<p><strong>Запуск ассистента:</strong></p>
<pre class="language-terminal"><code># Откройте терминал
# Введите команду:
ollama run depression-support
# Появится приглашение &gt;&gt;&gt;
# Можете писать
</code>
</pre>
</div>
<div class="row-gap--xs">
<p><strong>Ежедневный чек-ин (30&nbsp;секунд):</strong></p>
<pre class="language-terminal"><code>&gt;&gt;&gt; Настроение: 4/10
[ответ]
&gt;&gt;&gt; /bye
</code>
</pre>
</div>
<div class="row-gap--xs">
<p><strong>Декомпозиция задачи <span class="noperenos">(2-5 минут):</span></strong></p>
<pre class="language-terminal"><code>&gt;&gt;&gt; Мне нужно [задача], но я парализован и не могу начать
[ответ с микрошагами]
&gt;&gt;&gt; /bye
</code>
</pre>
</div>
<div class="row-gap--xs">
<p><strong>Рефрейминг самообвинений:</strong></p>
<pre class="language-terminal"><code>&gt;&gt;&gt; Я ленивый / слабый / бесполезный
[рефрейминг]
&gt;&gt;&gt; /bye
</code>
</pre>
</div>
<div class="row-gap--xs">
<p><strong>Выход:</strong></p>
<pre class="language-terminal"><code>&gt;&gt;&gt; /bye
</code>
</pre>
</div>
</section>


<section class="row-gap--m mb-1">
<h3 class="h3">Важные ограничения</h3>
<ul class="row-gap--xs list--leftpadding"> 
	<li> 
		<p><strong>Нет автосохранения:</strong> После <code>/bye</code> контекст удаляется. Если нужно продолжить тему&nbsp;— напомните контекст вручную.</p>
 	</li>
	<li> 
		<p><strong>Одна сессия = один «чат»:</strong> В&nbsp;отличие от&nbsp;веб-интерфейса (где есть история чатов), в&nbsp;терминале каждый запуск&nbsp;— новая сессия.</p>
 	</li>
	<li> 
		<p><strong>Скорость:</strong> Ответы занимают <nobr>10-20</nobr> секунд (vs&nbsp;мгновенно в&nbsp;облаке). Это нормально для локальной модели.</p>
 	</li>
	<li> 
		<p><strong>Качество:</strong> Llama&nbsp;3.1&nbsp;хороша, но&nbsp;уступает GPT-5/Claude в&nbsp;сложных случаях.</p>
 	</li>
 </ul>
</section>



<section class="row-gap--m mb-1">
<h3 class="h3">Рекомендуемый режим использования</h3>
<div class="row-gap--xs">
<p>Неделя 1-2: Привыкание</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>1&nbsp;чек-ин в&nbsp;день (утро или вечер).</li>
	<li>Только цифра настроения, ничего больше.</li>
 </ul>
</div>
<div class="row-gap--xs">
<p>Неделя 3-4: Расширение</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Утренний чек-ин: настроение + одна фраза о&nbsp;дне.</li>
	<li>По&nbsp;необходимости: декомпозиция задач.</li>
 </ul>
</div>
<div class="row-gap--xs">
<p>Месяц&nbsp;2+: Анализ паттернов</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Раз в&nbsp;неделю (воскресенье): попросить ассистента проанализировать настроения недели.</li>
 </ul>
</div>

</section>

</section>




<section class="row-gap--m mb-2" id="boundaries">
<h2 class="h2">5) Границы и&nbsp;супервизия</h2>

<section class="row-gap--xs mb-1">
<h3 class="h3">Что AI-ассистент НЕ&nbsp;заменяет</h3>
<div class="row-gap--xs">
<p>❌ <strong>Психотерапию:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Работа с&nbsp;травмой.</li>
	<li>Глубинная проработка.</li>
 </ul>
</div>
<div class="row-gap--xs">
<p>❌ <strong>Психиатрическую помощь:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Назначение/корректировка медикаментов.</li>
	<li>Оценка суицидального риска.</li>
	<li>Работа с&nbsp;острыми состояниями.</li>
 </ul>
</div>
<div class="row-gap--xs">
<p>❌ <strong>Человеческую связь:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Эмпатия AI&nbsp;— симуляция, не&nbsp;настоящее чувство.</li>
	<li>Нет физического присутствия.</li>
	<li>Нет невербальных сигналов.</li>
 </ul>
</div>
</section>

<section class="row-gap--xs mb-1">
<h3 class="h3">Роль AI-ассистента</h3>
<div class="row-gap--xs">
<p>✅ <strong>Между сессиями терапии:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Структурированная поддержка 24/7.</li>
	<li>Экстернализация исполнительных функций (декомпозиция).</li>
	<li>Валидация эмоций.</li>
	<li>Напоминание о&nbsp;техниках из&nbsp;терапии.</li>
 </ul>
</div>
<div class="row-gap--xs">
<p>✅ <strong>Трекинг состояния:</strong></p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Ежедневные чек-ины (минимальная нагрузка).</li>
	<li>Выявление паттернов во&nbsp;времени.</li>
	<li>Данные для обсуждения с&nbsp;терапевтом.</li>
 </ul>
</div>
</section>

<section class="row-gap--xs mb-1">
<h3 class="h3">Обязательная супервизия</h3>
<div class="row-gap--xs">
<p><strong>Еженедельно (или раз в&nbsp;2&nbsp;недели):</strong></p>
<p>Клиент приносит на&nbsp;сессию:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Частоту использования&nbsp;AI («Сколько раз в&nbsp;день обращались?»).</li>
	<li>Типичные запросы («О&nbsp;чём чаще всего спрашивали?»).</li>
	<li>Инсайты, которые получил.</li>
 </ul>
</div>

</section>

<section class="row-gap--xs mb-1">
<h3 class="h3">Красные флаги (когда остановить использование)</h3>
<p>🚩 Клиент обращается к&nbsp;AI &gt;5 раз в&nbsp;день.<br/>
 🚩 Отказывается от&nbsp;социальных контактов в&nbsp;пользу AI.<br/>
 🚩 Говорит «AI&nbsp;понимает меня лучше людей».<br/>
 🚩 Использует AI&nbsp;вместо кризисной помощи при суицидальных мыслях.<br/>
 🚩 Бросил реальную терапию, «потому что есть AI».
</p>
<p><strong>Действия:</strong> Обсудить риски, установить лимиты использования или полностью прекратить.</p>
</section>

</section>



<section class="row-gap--m mb-2" id="faq">
<h2 class="h2">6) Часто задаваемые вопросы</h2>

<details>
<summary>Q: Можно&nbsp;ли использовать на&nbsp;Windows?</summary>
<div class="details-content">
<p><span class="bold">A:</span> Да. Процесс установки:</p>
<ol class="row-gap--xs list--leftpadding"> 
	<li>Скачайте Ollama для Windows: <a class="link" href="https://ollama.com/download/windows">https://ollama.com/download/windows</a></li>
	<li>Запустите установщик</li>
	<li>Откройте PowerShell или Command Prompt</li>
	<li>Выполните: <code>ollama pull llama3.1:8b</code></li>
	<li>Создайте Modelfile (аналогично Linux-инструкции)</li>
 </ol>
</div>
</details>


<details>
<summary>Q: Нужна&nbsp;ли видеокарта (GPU)?</summary>
<div class="details-content">
<p><span class="bold">A:</span> Не&nbsp;обязательно, но&nbsp;желательно.</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li><span class="bold">Без GPU (только CPU):</span> Llama&nbsp;3.1 8B&nbsp;работает со&nbsp;скоростью ~15-20&nbsp;токенов/сек (ответ за&nbsp;<nobr>10-20 сек)</nobr></li>
	<li><span class="bold">С&nbsp;NVIDIA GPU (8GB+ VRAM):</span> Скорость возрастает в&nbsp;<nobr>5-10</nobr> раз (~100-200&nbsp;токенов/сек, почти мгновенно)</li>
 </ul>
<p>Для базового использования (чек-ины, декомпозиция) CPU достаточно.</p>
</div>
</details>


<details>
<summary>Q: Как клиент может сохранить историю диалогов?</summary>
<div class="details-content">
<p><span class="bold">A:</span> Вручную. Варианты:</p>
<div class="row-gap--xs">
<p><span class="bold">Простой (копипаст):</span> После важного диалога скопировать вывод терминала и&nbsp;вставить в&nbsp;текстовый файл.</p>
</div>
<div class="row-gap--xs">
<p><span class="bold">Автоматический (для продвинутых):</span></p>
<pre class="language-terminal"><code>ollama run depression-support | tee ~/mental-health-log-$(date +%Y-%m-%d).txt
</code></pre>
<p>Всё, что будет написано в&nbsp;сессии, сохранится в&nbsp;файл с&nbsp;датой.</p>
</div>
<p><span class="bold">НО:</span> Для большинства клиентов с&nbsp;депрессией ручное сохранение&nbsp;— избыточная когнитивная нагрузка. Лучше не&nbsp;сохранять вообще.</p>
</div>
</details>


<details>
<summary>Q: Что делать, если клиент жалуется на&nbsp;медленные ответы?</summary>
<div class="details-content">
<p><span class="bold">A:</span> Три варианта:</p>
<ol class="row-gap--xs list--leftpadding"> 
	<li> 
		<p><span class="bold">Использовать меньшую модель:</span></p>
		<pre class="language-terminal"><code>ollama pull mistral:7b-instruct
# Быстрее Llama 3.1 8B, но чуть ниже качество
</code></pre>
 	</li>
	<li> 
		<p><span class="bold">Купить GPU:</span> NVIDIA RTX 3060 (12GB) или выше&nbsp;— скорость возрастёт в&nbsp;10&nbsp;раз</p>
 	</li>
	<li> 
		<p><span class="bold">Вернуться к&nbsp;облаку:</span> Claude/ChatGPT с&nbsp;защитами (обезличивание, удаление через 30&nbsp;дней)</p>
 	</li>
 </ol>
</div>
</details>


<details>
<summary>Q: Безопасно&nbsp;ли это с&nbsp;точки зрения данных?</summary>
<div class="details-content">
<p><span class="bold">A:</span> При локальной установке:</p>
<p>✅ Данные НЕ&nbsp;отправляются в&nbsp;интернет<br/>
 ✅ Модель работает полностью офлайн<br/>
 ✅ История хранится только на&nbsp;компьютере клиента<br/>
 ✅ Можно удалить всё: <code>rm -rf ~/.ollama</code> 
</p>
<p><span class="bold">НО:</span> Компьютер клиента должен быть защищён:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li>Пароль на&nbsp;вход.</li>
	<li>Шифрование диска (FileVault на&nbsp;macOS, LUKS на&nbsp;Linux).</li>
	<li>Антивирус.</li>
 </ul>
</div>
</details>


<details>
<summary>Q: Можно&nbsp;ли использовать другие модели?</summary>
<div class="details-content">
<p><span class="bold">A:</span> Да. Альтернативы Llama&nbsp;3.1:</p>
<ul class="row-gap--xs list--leftpadding"> 
	<li><strong>Mistral 7B:</strong> Быстрее, чуть менее эмпатична.</li>
	<li><strong>Gemma&nbsp;2 (9B):</strong> От&nbsp;Google, хороший русский.</li>
	<li><strong>Phi-3 Medium (14B):</strong> Качественнее, но&nbsp;медленнее.</li>
 </ul>
<p>Команда для установки:</p>
<pre class="language-terminal"><code>ollama pull mistral:7b-instruct
ollama create my-model -f ~/modelfile  # с тем же Modelfile
</code></pre>
</div>
</details>

</section>





<section class="row-gap--m mb-2" id="checklist">
<h2 class="h2">7) Чеклист для внедрения</h2>
<section class="row-gap--m mb-1">
<h3 class="h3">Перед началом</h3>
<ul class="row-gap--xs list--nostyle"> 
	<li>[ ] Оценить технические навыки клиента (умеет&nbsp;ли открыть терминал?)</li>
	<li>[ ] Проверить конфигурацию компьютера (16GB+ RAM)</li>
	<li>[ ] Обсудить риски облака vs&nbsp;локального решения</li>
	<li>[ ] Получить информированное согласие</li>
	<li>[ ] Установить границы: AI&nbsp;дополняет терапию, не&nbsp;заменяет</li>
 </ul>
 </section>
<section class="row-gap--m mb-1">
<h3 class="h3">Установка</h3>
<ul class="row-gap--xs list--nostyle"> 
	<li>[ ] Установить Ollama (команда: <code>curl -fsSL https://ollama.com/install.sh | sh</code>)</li>
	<li>[ ] Запустить сервис (Linux: <code>sudo systemctl start ollama</code>)</li>
	<li>[ ] Загрузить модель (<code>ollama pull llama3.1:8b</code>)</li>
	<li>[ ] Создать кастомную модель с&nbsp;промптом под депрессию</li>
	<li>[ ] Протестировать: чек-ин, декомпозиция, рефрейминг</li>
 </ul>
 </section>
<section class="row-gap--m mb-1">
<h3 class="h3">Обучение клиента</h3>
<ul class="row-gap--xs list--nostyle"> 
	<li>[ ] Показать базовые команды (<code>ollama run</code>, <code>/bye</code>)</li>
	<li>[ ] Объяснить отсутствие автосохранения</li>
	<li>[ ] Установить режим использования (≤3 раза в&nbsp;день)</li>
	<li>[ ] Дать письменную инструкцию</li>
 </ul>
</section>
<section class="row-gap--m mb-1">
<h3 class="h3">Супервизия</h3>
<ul class="row-gap--xs list--nostyle"> 
	<li>[ ] Раз в&nbsp;2&nbsp;недели обсуждать использование AI</li>
	<li>[ ] Отслеживать красные флаги (&gt;5 раз в&nbsp;день, избегание людей)</li>
	<li>[ ] Анализировать инсайты из&nbsp;диалогов с&nbsp;AI</li>
	<li>[ ] Корректировать подход при необходимости</li>
 </ul>
</section>
</section>