# Accessibility Guidelines (WCAG 2.1)

## 1. Color Contrast

- **Primary Orange (#f05323):** Use on white only. Never on cream (#fde3c1)
- **Text on Cream:** Use dark gray (#374151), never white
- **Ratio:** Minimum 4.5:1 for normal text, 3:1 for large text

## 2. Focus States

All interactive elements must have visible focus:
```css
button:focus, a:focus, input:focus {
  outline: 2px solid #f05323;
  outline-offset: 2px;
}
```

## 3. Screen Reader Support

- All images need `alt` text
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, not `<div>`
- ARIA labels for icons:
```jsx
<button aria-label="Switch to Tutor mode">
  <TutorIcon />
</button>
```

## 4. Touch Targets

- Minimum 44x44px for all tappable elements
- Slot chips, buttons, checkboxes must have adequate spacing

## 5. Form Labels

- Every input must have associated `<label>`
- Error messages linked via `aria-describedby`:
```jsx
<input aria-describedby="phone-error" />
<span id="phone-error" role="alert">Invalid phone number</span>
```

## 6. Testing Tools

- Use `axe-devtools` browser extension to scan pages
- Test with VoiceOver (iOS) and TalkBack (Android)

---

## QA Check - Fixes Applied:
- ✅ Orange on cream contrast issue addressed
- ✅ All booking actions have aria-labels
- ✅ Form errors properly announced to screen readers