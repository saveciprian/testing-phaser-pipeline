export function enablePlayer()
{
  const r = new rive.Rive({
    src: '/testing_frames.riv',
    canvas: document.getElementById("riveCanvas"),
    autoplay: true,
    // artboard: "Arboard", // Optional. If not supplied the default is selected
    stateMachines: "State Machine 1",
    onLoad: () => {
      r.resizeToCanvas();
    },
  });
}

