# TODO

## Fix TypeScript compilation errors in `src/components/CommentComponent.tsx`
- [ ] Add explicit TypeScript types for:
  - [ ] `Avatar` props
  - [ ] `FileAttachment` props
  - [ ] `FieldCommentPanel` props
  - [ ] `CommentsDialog` props
  - [ ] `submittedData` state shape
  - [ ] `fileInputRef` type
- [ ] Replace JSDoc/implicit typing with real TS types (remove `setState(null)` inference issues)
- [ ] Fix `useState(null)` / union types so `setFile(File)` is allowed
- [ ] Type `formatSize` parameter as `number`
- [ ] Ensure event handlers use proper React event types where needed
- [ ] Run `npm run build` (or the project’s TS build command) to confirm compilation succeeds

