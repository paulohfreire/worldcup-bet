🧩 1. Tela: Login
+----------------------------------+
| LOGO / TITLE |
|----------------------------------|
| Email |
| [__________________________] |
| |
| Password |
| [__________________________] |
| |
| [ Login Button ] |
| |
| Don't have an account? Register |
+----------------------------------+
Regras
simples, centralizado
validação básica
redirect → /dashboard
🧩 2. Tela: Cadastro
+----------------------------------+
| CREATE ACCOUNT |
|----------------------------------|
| Name |
| [__________________________] |
| |
| Email |
| [__________________________] |
| |
| Password |
| [__________________________] |
| |
| Confirm Password |
| [__________________________] |
| |
| [ Register Button ] |
+----------------------------------+
🧩 3. Dashboard
+----------------------------------------------+
| Logo | Dashboard | Matches | Ranking | Logout|
+----------------------------------------------+

| Welcome, João 👋 |

+-------------------+------------------------+
| Progress | Ranking Position |
| 32 / 64 matches | #3 |
+-------------------+------------------------+

| Next Matches to Predict   |
| ------------------------- |
| 🇧🇷 Brazil vs 🇦🇷 Argentina |
| [ Predict ]               |

| 🇫🇷 France vs 🇩🇪 Germany |
| [ Predict ] |
+-------------------------------------------+
Objetivo
visão rápida
CTA claro → palpitar
🧩 4. Tela: Jogos / Palpites
+--------------------------------------------------+
| Matches |
+--------------------------------------------------+

[ Group Stage ]

🇧🇷 Brazil [ 2 ] x [ 1 ] Argentina 🇦🇷
[ Save ] (Saved ✔)

🇫🇷 France [ _ ] x [ _ ] Germany 🇩🇪
[ Save ]

---

[ Round of 16 ]

(locked 🔒 or editable)

+--------------------------------------------------+
Regras importantes
inputs numéricos
botão salvar por jogo (MVP)
status:
✔ salvo
🔒 bloqueado
🧩 5. Tela: Simulação (mata-mata)
+------------------- SIMULATION -------------------+

          [ Quarter Finals ]

🇧🇷 Brazil vs Argentina 🇦🇷
( ) Brazil ( ) Argentina

          ↓

          [ Semi Finals ]

                ↓

              [ FINAL ]

       Brazil vs France
       ( ) Brazil
       ( ) France

---

Champion:
[ 🇧🇷 Brazil ]

[ Save Simulation ]
Observação importante

👉 MVP: pode ser simples (não precisa bracket bonito)

🧩 6. Tela: Ranking
+---------------------- RANKING ----------------------+

# Name Points Exact Winner

---

1 João 45 10 15
2 Maria 42 9 15
3 Pedro 40 8 16

---

[ Export PDF ]
[ Export Table ]
🧩 7. Tela: Export
+------------------- EXPORT -------------------+

Select export type:

( ) Ranking
( ) My Predictions
( ) Full Simulation

---

[ Export as PDF ]
[ Export as Table ]

---

Preview (optional)
🧩 8. Navegação global (layout base)
+--------------------------------------------------+
| Logo | Dashboard | Matches | Ranking | Export |
+--------------------------------------------------+

(content here)
Mobile
☰ Menu

- Dashboard
- Matches
- Ranking
- Export
- Logout

🎯 Decisões importantes já embutidas
✅ Simplicidade extrema (MVP)
nada de gráficos complexos
nada de animações
foco em funcionalidade
✅ UX pensada pro uso real
salvar rápido
ver progresso
ranking simples
✅ Preparado pra evolução
simulação pode virar bracket visual depois
ranking pode ganhar filtros
export pode melhorar layout
