export default {
  fetch(_req: Request): Response {
    return Response.json({
      function: 'goodbye',
      message: 'Goodbye from Neon Functions!',
    });
  },
};
