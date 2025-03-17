import { closeSnackbar, SnackbarProvider } from "notistack"
import { Router } from "./Routes"

function App() {
  return (
    <SnackbarProvider
      maxSnack={10}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      action={(key) => (
        <button
          onClick={() => closeSnackbar(key)}
          style={{
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%'
          }}
        />
      )}
      style={{ fontFamily: 'Roboto', fontSize: "var(--size-m)" }}
    >
      <Router />
      {/* <InputAdornments /> */}
    </SnackbarProvider>
  )
}

export default App