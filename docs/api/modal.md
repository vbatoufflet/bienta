# Modal

## Open modal

Open a modal using a Vue component as its content:

```typescript
bienta.openModal(component, {}).then(
    value => {
        // Promise fulfilled
    },
    err => {
        // Promise rejected
    },
);
```

## Close modal

Close the modal fulfilling the promise:

```typescript
bienta.closeModal("Any value here")
```

Close the modal rejecting the promise:

```typescript
bienta.closeModal("Rejection reason", true)
```
