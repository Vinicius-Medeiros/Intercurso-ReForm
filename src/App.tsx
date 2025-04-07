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
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              top: 0,
              background: "transparent",
            }}
          />
        )}
        style={{ fontFamily: 'Roboto' }}
      >
        <Router />
      </SnackbarProvider>
  )
}

export default App