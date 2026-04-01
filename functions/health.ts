interface Env {}

export const onRequestGet: PagesFunction<Env> = async () => {
  return Response.json({
    ok: true,
    service: "refrigerator-helper",
    timestamp: new Date().toISOString(),
  });
};
