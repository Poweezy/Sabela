// Interactive Climate Quiz for The Climate Watch
// Educational quiz to engage users and test climate knowledge

document.addEventListener('DOMContentLoaded', function() {
    // Quiz configuration
    const QUIZ_CONFIG = {
        title: 'Test Your Climate Knowledge',
        description: 'Answer these questions to learn more about climate change and our work in Eswatini.',
        questions: [
            {
                id: 1,
                question: 'What is the primary cause of climate change?',
                options: [
                    'Natural weather cycles',
                    'Human activities releasing greenhouse gases',
                    'Changes in Earth\'s orbit',
                    'Volcanic eruptions'
                ],
                correct: 1,
                explanation: 'Human activities, particularly burning fossil fuels, deforestation, and industrial processes, release greenhouse gases that trap heat in the atmosphere.'
            },
            {
                id: 2,
                question: 'Which gas is most responsible for the greenhouse effect?',
                options: [
                    'Oxygen',
                    'Nitrogen',
                    'Carbon dioxide',
                    'Helium'
                ],
                correct: 2,
                explanation: 'Carbon dioxide (CO₂) is the primary greenhouse gas emitted through human activities and is the main driver of global warming.'
            },
            {
                id: 3,
                question: 'How does climate change affect Eswatini specifically?',
                options: [
                    'Increased rainfall and flooding',
                    'Droughts and water scarcity',
                    'Both A and B',
                    'No significant impact'
                ],
                correct: 2,
                explanation: 'Eswatini faces prolonged droughts, reduced agricultural productivity, and water scarcity due to changing rainfall patterns and higher temperatures.'
            },
            {
                id: 4,
                question: 'What is a sustainable solution to reduce carbon emissions?',
                options: [
                    'Planting trees and reforestation',
                    'Using more fossil fuels',
                    'Increasing plastic production',
                    'Deforestation for agriculture'
                ],
                correct: 0,
                explanation: 'Trees absorb CO₂ through photosynthesis. Reforestation and afforestation are effective natural solutions to combat climate change.'
            },
            {
                id: 5,
                question: 'What can individuals do to help fight climate change?',
                options: [
                    'Reduce energy consumption and waste',
                    'Drive more and use single-use plastics',
                    'Ignore environmental news',
                    'All of the above'
                ],
                correct: 0,
                explanation: 'Simple actions like conserving energy, recycling, using public transport, and supporting sustainable products make a big difference.'
            }
        ],
        passScore: 3,
        maxQuestions: 5
    };

    // Initialize quiz
    function initQuiz() {
        // Setup quiz button
        setupQuizButton();

        // Setup modal
        setupQuizModal();

        // Setup form
        setupQuizForm();

        // Add quiz styles
        addQuizStyles();

        // Preload questions
        preloadQuizQuestions();
    }

    // Setup quiz button
    function setupQuizButton() {
        const quizBtns = document.querySelectorAll('.quiz-btn, [onclick*="quizModal"]');

        quizBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showQuizModal();
            });
        });
    }

    // Setup quiz modal
    function setupQuizModal() {
        const modal = document.getElementById('quizModal');
        if (!modal) return;

        // Close modal handlers
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideQuizModal());
        }

        // Overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideQuizModal();
            }
        });

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideQuizModal();
            }
        });

        // Restart button
        const restartBtn = document.getElementById('restartQuiz');
        if (restartBtn) {
            restartBtn.addEventListener('click', resetQuiz);
        }
    }

    // Show quiz modal
    function showQuizModal() {
        const modal = document.getElementById('quizModal');
        if (!modal) return;

        // Reset quiz
        resetQuiz();

        // Show modal
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');

        // Focus first question
        const firstQuestion = modal.querySelector('.quiz-question');
        if (firstQuestion) {
            firstQuestion.querySelector('input').focus();
        }

        // Track quiz start
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_start', {
                event_category: 'engagement',
                event_label: 'climate_quiz'
            });
        }
    }

    // Hide quiz modal
    function hideQuizModal() {
        const modal = document.getElementById('quizModal');
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    // Setup quiz form
    function setupQuizForm() {
        const form = document.getElementById('quizForm');
        if (!form) return;

        form.addEventListener('submit', handleQuizSubmit);

        // Progress tracking
        form.addEventListener('change', updateQuizProgress);
    }

    // Generate quiz questions
    function generateQuizQuestions() {
        const form = document.getElementById('quizForm');
        if (!form) return;

        // Clear existing questions
        form.innerHTML = '';

        // Add questions
        QUIZ_CONFIG.questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            questionDiv.dataset.questionId = q.id;

            questionDiv.innerHTML = `
                <div class="question-header">
                    <div class="question-number">${index + 1}/${QUIZ_CONFIG.maxQuestions}</div>
                    <h3>${q.question}</h3>
                </div>
                <div class="options">
                    ${q.options.map((option, optIndex) => `
                        <label class="option-label">
                            <input type="radio" name="q${q.id}" value="${optIndex}" required>
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;

            form.appendChild(questionDiv);
        });

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn primary';
        submitBtn.innerHTML = '<i data-lucide="check"></i> Submit Quiz';
        form.appendChild(submitBtn);

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Update progress
        updateQuizProgress();
    }

    // Reset quiz
    function resetQuiz() {
        const form = document.getElementById('quizForm');
        const results = document.getElementById('quizResults');

        if (form) {
            generateQuizQuestions();
            form.style.display = 'block';
        }

        if (results) {
            results.style.display = 'none';
        }

        // Reset progress
        updateQuizProgress(0);
    }

    // Update quiz progress
    function updateQuizProgress() {
        const form = document.getElementById('quizForm');
        if (!form) return;

        const questions = form.querySelectorAll('.quiz-question');
        let answered = 0;

        questions.forEach(question => {
            const inputs = question.querySelectorAll('input[type="radio"]:checked');
            if (inputs.length > 0) {
                answered++;
            }
        });

        const progress = (answered / questions.length) * 100;
        const progressBar = document.querySelector('.quiz-progress .progress-fill');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        // Enable/disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = answered < questions.length;
        }
    }

    // Handle quiz submission
    function handleQuizSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Evaluating...';
        submitBtn.disabled = true;

        // Calculate score
        const score = calculateQuizScore(form);
        showQuizResults(score);

        // Track quiz completion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_complete', {
                event_category: 'engagement',
                event_label: 'climate_quiz',
                value: score
            });
        }

        // Submit to backend if needed
        if (typeof FormHandler !== 'undefined') {
            const formData = new FormData();
            formData.append('quiz-score', score);
            formData.append('quiz-completed', true);

            // Simulate submission
            setTimeout(() => {
                FormHandler.showMessage(document.querySelector('.form-message') || document.createElement('div'), 'Quiz results saved! Thank you for participating.', 'success');
            }, 1000);
        }
    }

    // Calculate quiz score
    function calculateQuizScore(form) {
        let score = 0;

        QUIZ_CONFIG.questions.forEach(q => {
            const selected = form.querySelector(`input[name="q${q.id}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
                score++;
            }
        });

        return score;
    }

    // Show quiz results
    function showQuizResults(score) {
        const form = document.getElementById('quizForm');
        const results = document.getElementById('quizResults');
        const modal = document.getElementById('quizModal');

        if (!form || !results || !modal) return;

        const percentage = (score / QUIZ_CONFIG.questions.length) * 100;
        const passed = score >= QUIZ_CONFIG.passScore;

        // Hide form
        form.style.display = 'none';

        // Show results
        results.style.display = 'block';
        results.innerHTML = `
            <div class="results-header">
                <div class="score-circle">
                    <span class="score">${score}/${QUIZ_CONFIG.questions.length}</span>
                    <span class="percentage">${percentage.toFixed(0)}%</span>
                </div>
                <h3>${passed ? 'Great Job!' : 'Good Effort!'}</h3>
                <p class="result-message ${passed ? 'success' : 'warning'}">
                    ${passed ? 'You have a solid understanding of climate issues!' : 'There\'s always more to learn about climate change.'}
                </p>
            </div>
            <div class="detailed-results">
                <h4>Your Answers:</h4>
                ${generateDetailedResults(score)}
            </div>
            <div class="quiz-actions">
                <button id="restartQuiz" class="btn secondary">Restart Quiz</button>
                <button class="btn primary" onclick="if (typeof ClimateWatch !== 'undefined') { ClimateWatch.shareQuiz(${score}); } else { alert('Share your score: ${score}/${QUIZ_CONFIG.questions.length}'); }">
                    <i data-lucide="share-2"></i>
                    Share Results
                </button>
            </div>
        `;

        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });

        // Re-setup restart button
        document.getElementById('restartQuiz').addEventListener('click', resetQuiz);

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Generate detailed results
    function generateDetailedResults(score) {
        let resultsHtml = '';

        QUIZ_CONFIG.questions.forEach(q => {
            const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
            const userAnswer = selected ? parseInt(selected.value) : -1;
            const isCorrect = userAnswer === q.correct;
            const optionText = q.options[userAnswer];

            resultsHtml += `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="result-header">
                        <span class="question-num">Q${q.id}</span>
                        <span class="status-icon">${isCorrect ? '✓' : '✗'}</span>
                    </div>
                    <div class="result-content">
                        <p class="user-answer"><strong>Your answer:</strong> ${optionText || 'No answer selected'}</p>
                        ${!isCorrect ? `<p class="correct-answer"><strong>Correct answer:</strong> ${q.options[q.correct]}</p>` : ''}
                        <p class="explanation">${q.explanation}</p>
                    </div>
                </div>
            `;
        });

        return resultsHtml;
    }

    // Preload quiz questions (for performance)
    function preloadQuizQuestions() {
        // Questions are already in config, but could fetch from API
        console.log('Quiz questions preloaded');
    }

    // Add quiz styles
    function addQuizStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Quiz Modal Enhancements */
            #quizModal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                animation: fadeIn 0.3s ease;
            }

            .modal-content {
                background: white;
                margin: 2% auto;
                padding: 0;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.25rem;
            }

            .close {
                color: white;
                font-size: 24px;
                cursor: pointer;
                background: none;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .modal-body {
                padding: 1.5rem;
            }

            /* Quiz Form Styles */
            #quizForm {
                display: block;
            }

            .quiz-question {
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }

            .quiz-question:last-child {
                border-bottom: none;
                margin-bottom: 1rem;
            }

            .question-header {
                margin-bottom: 1rem;
            }

            .question-number {
                background: #16a34a;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                display: inline-block;
                margin-bottom: 0.5rem;
            }

            .question-header h3 {
                margin: 0 0 1rem 0;
                color: #1a365d;
                font-size: 1.125rem;
            }

            .options {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .option-label {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                cursor: pointer;
                padding: 0.75rem;
                border-radius: 8px;
                transition: background 0.2s;
                font-size: 0.95rem;
            }

            .option-label:hover {
                background: rgba(22, 163, 74, 0.05);
            }

            .option-label input[type="radio"] {
                width: 18px;
                height: 18px;
                margin-top: 0.125rem;
                accent-color: #16a34a;
                flex-shrink: 0;
            }

            .option-text {
                line-height: 1.4;
                color: #374151;
            }

            #quizForm button[type="submit"] {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            #quizForm button[type="submit"]:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
            }

            #quizForm button[type="submit"]:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .quiz-progress {
                width: 100%;
                height: 4px;
                background: rgba(22, 163, 74, 0.2);
                border-radius: 2px;
                margin: 1.5rem 0;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #16a34a;
                transition: width 0.3s ease;
                width: 0%;
            }

            /* Results Styles */
            #quizResults {
                display: none;
            }

            .results-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .score-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: linear-gradient(135deg, #16a34a, #15803d);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                color: white;
                font-weight: 600;
            }

            .score-circle .score {
                font-size: 2rem;
                margin-bottom: 0.25rem;
            }

            .score-circle .percentage {
                font-size: 0.875rem;
                opacity: 0.9;
            }

            .result-message {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                margin: 1rem 0;
            }

            .result-message.success {
                background: rgba(16, 185, 129, 0.1);
                color: #065f46;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }

            .result-message.warning {
                background: rgba(245, 158, 11, 0.1);
                color: #92400e;
                border: 1px solid rgba(245, 158, 11, 0.2);
            }

            .detailed-results {
                margin-bottom: 2rem;
            }

            .detailed-results h4 {
                margin-bottom: 1rem;
                color: #1a365d;
                text-align: center;
            }

            .result-item {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border-left: 4px solid;
            }

            .result-item.correct {
                border-left-color: #10b981;
                background: rgba(16, 185, 129, 0.05);
            }

            .result-item.incorrect {
                border-left-color: #ef4444;
                background: rgba(239, 68, 68, 0.05);
            }

            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .question-num {
                background: #6b7280;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
            }

            .status-icon {
                font-size: 1.25rem;
                font-weight: bold;
            }

            .status-icon::before {
                content: '';
            }

            .result-item.correct .status-icon {
                color: #10b981;
            }

            .result-item.incorrect .status-icon {
                color: #ef4444;
            }

            .result-content {
                padding-left: 0.5rem;
            }

            .user-answer, .correct-answer {
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .user-answer {
                color: #6b7280;
            }

            .correct-answer {
                color: #10b981;
            }

            .explanation {
                background: rgba(22, 163, 74, 0.05);
                padding: 0.75rem;
                border-radius: 6px;
                font-style: italic;
                color: #374151;
                line-height: 1.5;
                margin-top: 0.5rem;
            }

            .quiz-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn.primary {
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
            }

            .btn.primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
            }

            .btn.secondary {
                background: transparent;
                color: #6b7280;
                border: 2px solid #d1d5db;
            }

            .btn.secondary:hover {
                background: #f9fafb;
                border-color: #16a34a;
                color: #16a34a;
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 1rem auto;
                }

                .question-header h3 {
                    font-size: 1rem;
                }

                .option-label {
                    padding: 0.5rem;
                    font-size: 0.9rem;
                }

                .score-circle {
                    width: 100px;
                    height: 100px;
                }

                .score-circle .score {
                    font-size: 1.5rem;
                }

                .quiz-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize quiz
    initQuiz();

    // Export for global access
    window.QuizManager = {
        showModal: showQuizModal,
        reset: resetQuiz,
        calculateScore: calculateQuizScore
    };
});
