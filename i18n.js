/* ============================================
   VAULT — i18n Translation Service
   Supports: en, de, sq, fr, it
   ============================================ */

const I18N = {
  currentLang: localStorage.getItem('vault-lang') || 'en',
  supportedLangs: {
    en: { label: 'English', flag: '🇬🇧' },
    de: { label: 'Deutsch', flag: '🇩🇪' },
    sq: { label: 'Shqip', flag: '🇦🇱' },
    fr: { label: 'Français', flag: '🇫🇷' },
    it: { label: 'Italiano', flag: '🇮🇹' },
  },

  translations: {
    // ---- AUTH ----
    'auth.welcome': {
      en: 'Welcome back', de: 'Willkommen zurück', sq: 'Mirë se u kthyet', fr: 'Bienvenue', it: 'Bentornato'
    },
    'auth.signin_subtitle': {
      en: 'Sign in to your financial dashboard', de: 'Melden Sie sich bei Ihrem Finanz-Dashboard an', sq: 'Hyni në panelin tuaj financiar', fr: 'Connectez-vous à votre tableau de bord financier', it: 'Accedi alla tua dashboard finanziaria'
    },
    'auth.email': {
      en: 'Email', de: 'E-Mail', sq: 'Email', fr: 'E-mail', it: 'Email'
    },
    'auth.password': {
      en: 'Password', de: 'Passwort', sq: 'Fjalëkalimi', fr: 'Mot de passe', it: 'Password'
    },
    'auth.enter_password': {
      en: 'Enter your password', de: 'Passwort eingeben', sq: 'Shkruani fjalëkalimin', fr: 'Entrez votre mot de passe', it: 'Inserisci la password'
    },
    'auth.remember_me': {
      en: 'Remember me', de: 'Angemeldet bleiben', sq: 'Më mbaj mend', fr: 'Se souvenir de moi', it: 'Ricordami'
    },
    'auth.forgot_password': {
      en: 'Forgot password?', de: 'Passwort vergessen?', sq: 'Keni harruar fjalëkalimin?', fr: 'Mot de passe oublié ?', it: 'Password dimenticata?'
    },
    'auth.sign_in': {
      en: 'Sign In', de: 'Anmelden', sq: 'Hyrje', fr: 'Se connecter', it: 'Accedi'
    },
    'auth.no_account': {
      en: "Don't have an account?", de: 'Noch kein Konto?', sq: 'Nuk keni llogari?', fr: "Vous n'avez pas de compte ?", it: 'Non hai un account?'
    },
    'auth.create_one': {
      en: 'Create one', de: 'Erstellen', sq: 'Krijoni një', fr: 'Créer un compte', it: 'Creane uno'
    },
    'auth.create_account': {
      en: 'Create account', de: 'Konto erstellen', sq: 'Krijo llogari', fr: 'Créer un compte', it: 'Crea account'
    },
    'auth.register_subtitle': {
      en: 'Start tracking your finances today', de: 'Beginnen Sie heute mit der Finanzverfolgung', sq: 'Filloni të gjurmoni financat tuaja sot', fr: "Commencez à suivre vos finances aujourd'hui", it: 'Inizia a monitorare le tue finanze oggi'
    },
    'auth.first_name': {
      en: 'First Name', de: 'Vorname', sq: 'Emri', fr: 'Prénom', it: 'Nome'
    },
    'auth.last_name': {
      en: 'Last Name', de: 'Nachname', sq: 'Mbiemri', fr: 'Nom', it: 'Cognome'
    },
    'auth.min_chars': {
      en: 'Min 8 characters', de: 'Min. 8 Zeichen', sq: 'Min 8 karaktere', fr: 'Min 8 caractères', it: 'Min 8 caratteri'
    },
    'auth.create_account_btn': {
      en: 'Create Account', de: 'Konto erstellen', sq: 'Krijo llogarinë', fr: 'Créer le compte', it: 'Crea account'
    },
    'auth.have_account': {
      en: 'Already have an account?', de: 'Bereits ein Konto?', sq: 'Keni tashmë një llogari?', fr: 'Vous avez déjà un compte ?', it: 'Hai già un account?'
    },
    'auth.sign_in_link': {
      en: 'Sign in', de: 'Anmelden', sq: 'Hyni', fr: 'Se connecter', it: 'Accedi'
    },
    'auth.reset_password': {
      en: 'Reset password', de: 'Passwort zurücksetzen', sq: 'Rivendos fjalëkalimin', fr: 'Réinitialiser le mot de passe', it: 'Reimposta password'
    },
    'auth.reset_subtitle': {
      en: "We'll send a reset link to your email", de: 'Wir senden Ihnen einen Link zum Zurücksetzen', sq: 'Do t\'ju dërgojmë një link rivendosjeje', fr: 'Nous vous enverrons un lien de réinitialisation', it: 'Ti invieremo un link per il reset'
    },
    'auth.send_reset': {
      en: 'Send Reset Link', de: 'Link senden', sq: 'Dërgo linkun', fr: 'Envoyer le lien', it: 'Invia link'
    },
    'auth.back_signin': {
      en: 'Back to sign in', de: 'Zurück zur Anmeldung', sq: 'Kthehu te hyrja', fr: 'Retour à la connexion', it: 'Torna al login'
    },
    'auth.check_email': {
      en: 'Check your email', de: 'Prüfen Sie Ihre E-Mail', sq: 'Kontrolloni emailin tuaj', fr: 'Vérifiez votre e-mail', it: 'Controlla la tua email'
    },
    'auth.reset_sent': {
      en: "We've sent a password reset link to your email address.", de: 'Wir haben einen Link zum Zurücksetzen an Ihre E-Mail gesendet.', sq: 'Kemi dërguar një link rivendosjeje në adresën tuaj të emailit.', fr: 'Nous avons envoyé un lien de réinitialisation à votre adresse e-mail.', it: 'Abbiamo inviato un link di reset alla tua email.'
    },
    'auth.back_to_signin': {
      en: 'Back to Sign In', de: 'Zurück zur Anmeldung', sq: 'Kthehu te Hyrja', fr: 'Retour à la connexion', it: 'Torna al login'
    },
    'auth.signing_in': {
      en: 'Signing in...', de: 'Anmeldung...', sq: 'Duke hyrë...', fr: 'Connexion...', it: 'Accesso...'
    },
    'auth.creating_account': {
      en: 'Creating account...', de: 'Konto wird erstellt...', sq: 'Duke krijuar llogarinë...', fr: 'Création du compte...', it: 'Creazione account...'
    },
    'auth.sending': {
      en: 'Sending...', de: 'Wird gesendet...', sq: 'Duke dërguar...', fr: 'Envoi...', it: 'Invio...'
    },

    // ---- NAVIGATION ----
    'nav.dashboard': {
      en: 'Dashboard', de: 'Dashboard', sq: 'Paneli', fr: 'Tableau de bord', it: 'Dashboard'
    },
    'nav.transactions': {
      en: 'Transactions', de: 'Transaktionen', sq: 'Transaksionet', fr: 'Transactions', it: 'Transazioni'
    },
    'nav.budgets': {
      en: 'Budgets', de: 'Budgets', sq: 'Buxhetet', fr: 'Budgets', it: 'Budget'
    },
    'nav.goals': {
      en: 'Goals', de: 'Ziele', sq: 'Qëllimet', fr: 'Objectifs', it: 'Obiettivi'
    },
    'nav.analytics': {
      en: 'Analytics', de: 'Analysen', sq: 'Analitika', fr: 'Analytiques', it: 'Analisi'
    },

    // ---- DASHBOARD ----
    'dashboard.title': {
      en: 'Dashboard', de: 'Dashboard', sq: 'Paneli', fr: 'Tableau de bord', it: 'Dashboard'
    },
    'dashboard.subtitle': {
      en: 'March 2026 Overview', de: 'Übersicht März 2026', sq: 'Pasqyrë Mars 2026', fr: 'Aperçu Mars 2026', it: 'Panoramica Marzo 2026'
    },
    'dashboard.export': {
      en: 'Export', de: 'Exportieren', sq: 'Eksporto', fr: 'Exporter', it: 'Esporta'
    },
    'dashboard.total_income': {
      en: 'Total Income', de: 'Gesamteinkommen', sq: 'Të ardhurat totale', fr: 'Revenu total', it: 'Entrate totali'
    },
    'dashboard.total_expenses': {
      en: 'Total Expenses', de: 'Gesamtausgaben', sq: 'Shpenzimet totale', fr: 'Dépenses totales', it: 'Spese totali'
    },
    'dashboard.savings': {
      en: 'Savings', de: 'Ersparnisse', sq: 'Kursimet', fr: 'Épargne', it: 'Risparmi'
    },
    'dashboard.net_balance': {
      en: 'Net Balance', de: 'Nettobilanz', sq: 'Bilanci neto', fr: 'Solde net', it: 'Saldo netto'
    },
    'dashboard.from_last_month': {
      en: 'from last month', de: 'gegenüber Vormonat', sq: 'nga muaji i kaluar', fr: 'par rapport au mois dernier', it: 'rispetto al mese scorso'
    },
    'dashboard.monthly_trends': {
      en: 'Monthly Trends', de: 'Monatliche Trends', sq: 'Trendet mujore', fr: 'Tendances mensuelles', it: 'Tendenze mensili'
    },
    'dashboard.income': {
      en: 'Income', de: 'Einkommen', sq: 'Të ardhura', fr: 'Revenus', it: 'Entrate'
    },
    'dashboard.expenses': {
      en: 'Expenses', de: 'Ausgaben', sq: 'Shpenzime', fr: 'Dépenses', it: 'Spese'
    },
    'dashboard.spending_by_category': {
      en: 'Spending by Category', de: 'Ausgaben nach Kategorie', sq: 'Shpenzimet sipas kategorisë', fr: 'Dépenses par catégorie', it: 'Spese per categoria'
    },
    'dashboard.recent_transactions': {
      en: 'Recent Transactions', de: 'Letzte Transaktionen', sq: 'Transaksionet e fundit', fr: 'Transactions récentes', it: 'Transazioni recenti'
    },
    'dashboard.view_all': {
      en: 'View all', de: 'Alle anzeigen', sq: 'Shiko të gjitha', fr: 'Voir tout', it: 'Vedi tutto'
    },

    // ---- TRANSACTIONS ----
    'transactions.title': {
      en: 'Transactions', de: 'Transaktionen', sq: 'Transaksionet', fr: 'Transactions', it: 'Transazioni'
    },
    'transactions.subtitle': {
      en: 'Manage your income and expenses', de: 'Verwalten Sie Ihre Einnahmen und Ausgaben', sq: 'Menaxhoni të ardhurat dhe shpenzimet tuaja', fr: 'Gérez vos revenus et dépenses', it: 'Gestisci entrate e uscite'
    },
    'transactions.add': {
      en: 'Add Transaction', de: 'Transaktion hinzufügen', sq: 'Shto transaksion', fr: 'Ajouter une transaction', it: 'Aggiungi transazione'
    },
    'transactions.search': {
      en: 'Search transactions...', de: 'Transaktionen suchen...', sq: 'Kërko transaksione...', fr: 'Rechercher des transactions...', it: 'Cerca transazioni...'
    },
    'transactions.all_categories': {
      en: 'All Categories', de: 'Alle Kategorien', sq: 'Të gjitha kategoritë', fr: 'Toutes les catégories', it: 'Tutte le categorie'
    },
    'transactions.all_types': {
      en: 'All Types', de: 'Alle Typen', sq: 'Të gjitha llojet', fr: 'Tous les types', it: 'Tutti i tipi'
    },
    'transactions.income': {
      en: 'Income', de: 'Einkommen', sq: 'Të ardhura', fr: 'Revenus', it: 'Entrate'
    },
    'transactions.expense': {
      en: 'Expense', de: 'Ausgabe', sq: 'Shpenzim', fr: 'Dépense', it: 'Spesa'
    },

    // ---- BUDGETS ----
    'budgets.title': {
      en: 'Budgets', de: 'Budgets', sq: 'Buxhetet', fr: 'Budgets', it: 'Budget'
    },
    'budgets.subtitle': {
      en: 'Track your spending limits', de: 'Verfolgen Sie Ihre Ausgabenlimits', sq: 'Gjurmoni limitet e shpenzimeve', fr: 'Suivez vos limites de dépenses', it: 'Monitora i tuoi limiti di spesa'
    },
    'budgets.add': {
      en: 'Add Budget', de: 'Budget hinzufügen', sq: 'Shto buxhet', fr: 'Ajouter un budget', it: 'Aggiungi budget'
    },
    'budgets.monthly': {
      en: 'Monthly', de: 'Monatlich', sq: 'Mujore', fr: 'Mensuel', it: 'Mensile'
    },
    'budgets.of': {
      en: 'of', de: 'von', sq: 'nga', fr: 'sur', it: 'di'
    },
    'budgets.used': {
      en: 'used', de: 'verwendet', sq: 'përdorur', fr: 'utilisé', it: 'utilizzato'
    },
    'budgets.over_budget': {
      en: 'Over budget!', de: 'Budget überschritten!', sq: 'Mbi buxhet!', fr: 'Dépassement de budget !', it: 'Budget superato!'
    },
    'budgets.monthly_limit': {
      en: 'Monthly Limit', de: 'Monatliches Limit', sq: 'Limiti mujor', fr: 'Limite mensuelle', it: 'Limite mensile'
    },

    // ---- GOALS ----
    'goals.title': {
      en: 'Savings Goals', de: 'Sparziele', sq: 'Qëllimet e kursimit', fr: "Objectifs d'épargne", it: 'Obiettivi di risparmio'
    },
    'goals.subtitle': {
      en: 'Track progress toward your targets', de: 'Verfolgen Sie Ihren Fortschritt', sq: 'Gjurmoni progresin drejt objektivave', fr: 'Suivez vos progrès vers vos objectifs', it: 'Monitora i progressi verso i tuoi obiettivi'
    },
    'goals.add': {
      en: 'Add Goal', de: 'Ziel hinzufügen', sq: 'Shto qëllim', fr: 'Ajouter un objectif', it: 'Aggiungi obiettivo'
    },
    'goals.due': {
      en: 'Due', de: 'Fällig', sq: 'Afati', fr: 'Échéance', it: 'Scadenza'
    },
    'goals.goal_name': {
      en: 'Goal Name', de: 'Zielname', sq: 'Emri i qëllimit', fr: "Nom de l'objectif", it: "Nome dell'obiettivo"
    },
    'goals.target_amount': {
      en: 'Target Amount', de: 'Zielbetrag', sq: 'Shuma e synuar', fr: 'Montant cible', it: 'Importo obiettivo'
    },
    'goals.saved_so_far': {
      en: 'Saved So Far', de: 'Bisher gespart', sq: 'Kursuar deri tani', fr: 'Épargné jusqu\'à présent', it: 'Risparmiato finora'
    },
    'goals.deadline': {
      en: 'Deadline', de: 'Frist', sq: 'Afati', fr: 'Date limite', it: 'Scadenza'
    },

    // ---- ANALYTICS ----
    'analytics.title': {
      en: 'Analytics', de: 'Analysen', sq: 'Analitika', fr: 'Analytiques', it: 'Analisi'
    },
    'analytics.subtitle': {
      en: 'Deep dive into your financial data', de: 'Tiefenanalyse Ihrer Finanzdaten', sq: 'Analizë e thellë e të dhënave financiare', fr: 'Analyse approfondie de vos données financières', it: 'Analisi approfondita dei tuoi dati finanziari'
    },
    'analytics.last_6_months': {
      en: 'Last 6 Months', de: 'Letzte 6 Monate', sq: '6 Muajt e fundit', fr: '6 derniers mois', it: 'Ultimi 6 mesi'
    },
    'analytics.last_12_months': {
      en: 'Last 12 Months', de: 'Letzte 12 Monate', sq: '12 Muajt e fundit', fr: '12 derniers mois', it: 'Ultimi 12 mesi'
    },
    'analytics.this_year': {
      en: 'This Year', de: 'Dieses Jahr', sq: 'Këtë vit', fr: 'Cette année', it: "Quest'anno"
    },
    'analytics.avg_income': {
      en: 'Avg. Monthly Income', de: 'Durchschn. Monatseinkommen', sq: 'Mesatarja e të ardhurave mujore', fr: 'Revenu mensuel moyen', it: 'Reddito mensile medio'
    },
    'analytics.avg_expenses': {
      en: 'Avg. Monthly Expenses', de: 'Durchschn. Monatsausgaben', sq: 'Mesatarja e shpenzimeve mujore', fr: 'Dépenses mensuelles moyennes', it: 'Spese mensili medie'
    },
    'analytics.savings_rate': {
      en: 'Savings Rate', de: 'Sparquote', sq: 'Norma e kursimit', fr: "Taux d'épargne", it: 'Tasso di risparmio'
    },
    'analytics.highest_expense': {
      en: 'Highest Expense', de: 'Höchste Ausgabe', sq: 'Shpenzimi më i lartë', fr: 'Dépense la plus élevée', it: 'Spesa più alta'
    },
    'analytics.income_vs_expenses': {
      en: 'Income vs Expenses', de: 'Einkommen vs. Ausgaben', sq: 'Të ardhura vs Shpenzime', fr: 'Revenus vs Dépenses', it: 'Entrate vs Spese'
    },
    'analytics.top_categories': {
      en: 'Top Spending Categories', de: 'Top-Ausgabenkategorien', sq: 'Kategoritë kryesore të shpenzimeve', fr: 'Principales catégories de dépenses', it: 'Principali categorie di spesa'
    },
    'analytics.savings_trend': {
      en: 'Monthly Savings Trend', de: 'Monatlicher Spartrend', sq: 'Trendi i kursimeve mujore', fr: "Tendance d'épargne mensuelle", it: 'Tendenza risparmi mensili'
    },

    // ---- CATEGORIES ----
    'cat.Housing': {
      en: 'Housing', de: 'Wohnen', sq: 'Banesa', fr: 'Logement', it: 'Alloggio'
    },
    'cat.Food': {
      en: 'Food', de: 'Essen', sq: 'Ushqim', fr: 'Alimentation', it: 'Cibo'
    },
    'cat.Transport': {
      en: 'Transport', de: 'Transport', sq: 'Transport', fr: 'Transport', it: 'Trasporto'
    },
    'cat.Shopping': {
      en: 'Shopping', de: 'Einkaufen', sq: 'Blerje', fr: 'Shopping', it: 'Shopping'
    },
    'cat.Entertainment': {
      en: 'Entertainment', de: 'Unterhaltung', sq: 'Argëtim', fr: 'Divertissement', it: 'Intrattenimento'
    },
    'cat.Healthcare': {
      en: 'Healthcare', de: 'Gesundheit', sq: 'Shëndetësia', fr: 'Santé', it: 'Sanità'
    },
    'cat.Salary': {
      en: 'Salary', de: 'Gehalt', sq: 'Paga', fr: 'Salaire', it: 'Stipendio'
    },
    'cat.Freelance': {
      en: 'Freelance', de: 'Freiberuflich', sq: 'Freelance', fr: 'Freelance', it: 'Freelance'
    },
    'cat.Utilities': {
      en: 'Utilities', de: 'Nebenkosten', sq: 'Shërbimet', fr: 'Services publics', it: 'Utenze'
    },
    'cat.Other': {
      en: 'Other', de: 'Sonstiges', sq: 'Tjetër', fr: 'Autre', it: 'Altro'
    },

    // ---- MODALS / FORMS ----
    'modal.add_transaction': {
      en: 'Add Transaction', de: 'Transaktion hinzufügen', sq: 'Shto transaksion', fr: 'Ajouter une transaction', it: 'Aggiungi transazione'
    },
    'modal.edit_transaction': {
      en: 'Edit Transaction', de: 'Transaktion bearbeiten', sq: 'Ndrysho transaksionin', fr: 'Modifier la transaction', it: 'Modifica transazione'
    },
    'modal.add_budget': {
      en: 'Add Budget', de: 'Budget hinzufügen', sq: 'Shto buxhet', fr: 'Ajouter un budget', it: 'Aggiungi budget'
    },
    'modal.edit_budget': {
      en: 'Edit Budget', de: 'Budget bearbeiten', sq: 'Ndrysho buxhetin', fr: 'Modifier le budget', it: 'Modifica budget'
    },
    'modal.add_goal': {
      en: 'Add Goal', de: 'Ziel hinzufügen', sq: 'Shto qëllim', fr: 'Ajouter un objectif', it: 'Aggiungi obiettivo'
    },
    'modal.edit_goal': {
      en: 'Edit Goal', de: 'Ziel bearbeiten', sq: 'Ndrysho qëllimin', fr: "Modifier l'objectif", it: 'Modifica obiettivo'
    },
    'form.name': {
      en: 'Name', de: 'Name', sq: 'Emri', fr: 'Nom', it: 'Nome'
    },
    'form.amount': {
      en: 'Amount', de: 'Betrag', sq: 'Shuma', fr: 'Montant', it: 'Importo'
    },
    'form.type': {
      en: 'Type', de: 'Typ', sq: 'Lloji', fr: 'Type', it: 'Tipo'
    },
    'form.category': {
      en: 'Category', de: 'Kategorie', sq: 'Kategoria', fr: 'Catégorie', it: 'Categoria'
    },
    'form.date': {
      en: 'Date', de: 'Datum', sq: 'Data', fr: 'Date', it: 'Data'
    },
    'form.update': {
      en: 'Update', de: 'Aktualisieren', sq: 'Përditëso', fr: 'Mettre à jour', it: 'Aggiorna'
    },
    'form.add': {
      en: 'Add', de: 'Hinzufügen', sq: 'Shto', fr: 'Ajouter', it: 'Aggiungi'
    },
    'form.transaction': {
      en: 'Transaction', de: 'Transaktion', sq: 'Transaksion', fr: 'Transaction', it: 'Transazione'
    },
    'form.budget': {
      en: 'Budget', de: 'Budget', sq: 'Buxhet', fr: 'Budget', it: 'Budget'
    },
    'form.goal': {
      en: 'Goal', de: 'Ziel', sq: 'Qëllim', fr: 'Objectif', it: 'Obiettivo'
    },

    // ---- NOTIFICATIONS ----
    'notif.welcome': {
      en: 'Welcome back, John!', de: 'Willkommen zurück, John!', sq: 'Mirë se u kthyet, John!', fr: 'Bienvenue, John !', it: 'Bentornato, John!'
    },
    'notif.account_created': {
      en: 'Account created successfully!', de: 'Konto erfolgreich erstellt!', sq: 'Llogaria u krijua me sukses!', fr: 'Compte créé avec succès !', it: 'Account creato con successo!'
    },
    'notif.transaction_deleted': {
      en: 'Transaction deleted', de: 'Transaktion gelöscht', sq: 'Transaksioni u fshi', fr: 'Transaction supprimée', it: 'Transazione eliminata'
    },
    'notif.transaction_updated': {
      en: 'Transaction updated', de: 'Transaktion aktualisiert', sq: 'Transaksioni u përditësua', fr: 'Transaction mise à jour', it: 'Transazione aggiornata'
    },
    'notif.transaction_added': {
      en: 'Transaction added', de: 'Transaktion hinzugefügt', sq: 'Transaksioni u shtua', fr: 'Transaction ajoutée', it: 'Transazione aggiunta'
    },
    'notif.budget_updated': {
      en: 'Budget updated', de: 'Budget aktualisiert', sq: 'Buxheti u përditësua', fr: 'Budget mis à jour', it: 'Budget aggiornato'
    },
    'notif.budget_added': {
      en: 'Budget added', de: 'Budget hinzugefügt', sq: 'Buxheti u shtua', fr: 'Budget ajouté', it: 'Budget aggiunto'
    },
    'notif.goal_updated': {
      en: 'Goal updated', de: 'Ziel aktualisiert', sq: 'Qëllimi u përditësua', fr: 'Objectif mis à jour', it: 'Obiettivo aggiornato'
    },
    'notif.goal_added': {
      en: 'Goal added', de: 'Ziel hinzugefügt', sq: 'Qëllimi u shtua', fr: 'Objectif ajouté', it: 'Obiettivo aggiunto'
    },
    'notif.budget_exceeded': {
      en: 'budget exceeded!', de: 'Budget überschritten!', sq: 'buxheti u tejkalua!', fr: 'budget dépassé !', it: 'budget superato!'
    },
    'notif.exporting': {
      en: 'Exporting report as PDF...', de: 'Bericht wird als PDF exportiert...', sq: 'Duke eksportuar raportin si PDF...', fr: 'Exportation du rapport en PDF...', it: 'Esportazione report in PDF...'
    },
    'notif.downloaded': {
      en: 'Report downloaded!', de: 'Bericht heruntergeladen!', sq: 'Raporti u shkarkua!', fr: 'Rapport téléchargé !', it: 'Report scaricato!'
    },
    'notif.analytics_updated': {
      en: 'Analytics period updated', de: 'Analysezeitraum aktualisiert', sq: 'Periudha e analitikës u përditësua', fr: "Période d'analyse mise à jour", it: 'Periodo di analisi aggiornato'
    },
    'notif.lang_changed': {
      en: 'Language changed to English', de: 'Sprache auf Deutsch geändert', sq: 'Gjuha u ndryshua në Shqip', fr: 'Langue changée en Français', it: 'Lingua cambiata in Italiano'
    },
  },

  // Get a translation by key
  t(key, replacements) {
    const entry = this.translations[key];
    if (!entry) return key;
    let text = entry[this.currentLang] || entry['en'] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  },

  // Translate a category name
  tc(categoryKey) {
    return this.t('cat.' + categoryKey) || categoryKey;
  },

  // Get locale string for current language
  getLocale() {
    const locales = { en: 'en-US', de: 'de-DE', sq: 'sq-AL', fr: 'fr-FR', it: 'it-IT' };
    return locales[this.currentLang] || 'en-US';
  },

  // Format date in current locale
  formatDate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString(this.getLocale(), { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Format currency in current locale
  formatCurrency(amount) {
    return amount.toLocaleString(this.getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // Set the language and apply translations
  setLanguage(lang) {
    if (!this.supportedLangs[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('vault-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    this.applyTranslations();
    // update all language selectors
    document.querySelectorAll('.lang-select').forEach(sel => sel.value = lang);
  },

  // Apply translations to all [data-i18n] elements
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      // for elements that have mixed content (text + links)
      const template = el.getAttribute('data-i18n-template');
      if (template) {
        el.innerHTML = template.replace(/\{(\w+)\}/g, (_, k) => this.t(k));
      } else {
        el.innerHTML = this.t(key);
      }
    });
  },

  // Build language selector HTML
  buildSelector(extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    let html = `<select class="lang-select${cls}" onchange="I18N.setLanguage(this.value); if(typeof refreshAllViews==='function') refreshAllViews();">`;
    for (const [code, info] of Object.entries(this.supportedLangs)) {
      const selected = code === this.currentLang ? ' selected' : '';
      html += `<option value="${code}"${selected}>${info.flag} ${info.label}</option>`;
    }
    html += '</select>';
    return html;
  },

  // Initialize
  init() {
    document.documentElement.setAttribute('lang', this.currentLang);
    this.applyTranslations();
    document.querySelectorAll('.lang-select').forEach(sel => sel.value = this.currentLang);
  }
};

// shorthand
function t(key, r) { return I18N.t(key, r); }
function tc(key) { return I18N.tc(key); }
