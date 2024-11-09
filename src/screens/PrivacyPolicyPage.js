import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import useThemeStyles from '../hooks/useThemeStyles';

export default function PrivacyPolicyPage() {

  const { themeStyles, colors } = useThemeStyles();

  return (
    <View style={[themeStyles.container, { paddingVertical: 20 }]}>
    <ScrollView indicatorStyle={colors.scrollbar}>
      <View style={[globalStyles.container, themeStyles.container, { paddingVertical: 0 }]}>
        <View style={styles.section}>
          <Text style={[styles.title, themeStyles.text]}>Politica de Confidențialitate - Altruism și Speranță</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Această politică de confidențialitate descrie modul în care aplicația „Altruism și Speranță” colectează, utilizează și protejează datele personale ale utilizatorilor. Aplicația este destinată exclusiv uzului intern al asociației și respectă reglementările GDPR și legislația națională română în vigoare.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>1. Date colectate</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            În cadrul aplicației colectăm următoarele date personale:
          </Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Adresa de email.</Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Detalii cont Gmail (în cazul utilizării autentificării prin Gmail).</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>2. Scopul colectării datelor</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Datele colectate vor fi utilizate în următoarele scopuri:
          </Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Gestionarea sarcinilor (task-urilor).</Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Planificarea evenimentelor.</Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Autentificare și administrarea accesului utilizatorilor în aplicație.</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>3. Partajarea datelor cu terți</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Nu partajăm datele colectate cu terți. Toate datele sunt utilizate exclusiv în scopuri interne.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>4. Stocarea și securitatea datelor</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Datele utilizatorilor sunt stocate pe baza de date Firebase, care asigură măsuri avansate de securitate pentru protecția informațiilor. Aplicația folosește aceste măsuri pentru a proteja datele împotriva accesului neautorizat, modificării, divulgării sau distrugerii.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>5. Drepturile utilizatorilor</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Utilizatorii au dreptul de a:
          </Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Modifica datele personale (inclusiv adresa de email și alte credențiale) prin intermediul paginii de Setări.</Text>
          <Text style={[styles.bulletPoint, themeStyles.text]}>• Șterge contul și toate datele asociate acestuia.</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>6. Cookies și tehnologii de urmărire</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Momentan, aplicația nu folosește cookie-uri sau alte tehnologii de urmărire. În cazul în care acest lucru se va schimba, vom actualiza această politică pentru a reflecta noile practici.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>7. Baza legală</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Prelucrarea datelor personale în cadrul acestei aplicații se realizează în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) și legislația română în vigoare.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>8. Păstrarea datelor</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Datele de autentificare vor fi păstrate pe o perioadă nedeterminată, până la ștergerea contului de către utilizator sau până când utilizatorul solicită ștergerea acestora.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, themeStyles.text]}>9. Contact</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.bodyText, themeStyles.text]}>
            Pentru orice întrebări sau solicitări privind datele personale, utilizatorii pot contacta asociația „Altruism și Speranță” prin email.
          </Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 16,
  },
  bulletPoint: {
    fontSize: 16,
  },
});
