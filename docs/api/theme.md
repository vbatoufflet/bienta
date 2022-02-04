# Theme

## List themes

Retrieve a map of existing themes embedded in Bienta:

```typescript
bienta.themes()
```

## Switch theme

Switch to a specific theme:

```typescript
bienta.switchTheme("dark")
```

Switch back to auto-detected theme:

```typescript
bienta.switchTheme(null)
```

Use external custom color theme:

```typescript
bienta.switchTheme("external", {
    "background": "black",
    "color": "deeppink",
    […]
})
```
