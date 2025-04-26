import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY =
  "MIIEowIBAAKCAQEAvH0rdSNZRq2jhoXS85yXgKOSqtgCe1xAgGWLxs+YJGRFn+6NkdbWBjxXXTINIPSWTS23eJlZkYc3up0zWJcffay0czumBombVDxd9YHzb8Rc1RCMA6MsqAXz4HLHZRuj0YFPrSl4l9eB2Hq5CRQbQBAd2euCuBbTaAKixedbGqGFeK5kgjP9fFBipcE2cSTbItSaBFzVILAjydW9yy0M0MeZnzw+G7NVKyRLW16AocvwieGqSp2eQQInmN0U+bDUqXpXslZX1uHqMWEu1XdVs5ebTw5wjtV6Td67TpV5g+NHtwT0vK6mXqoY7H9etRyeCnLMPMwcXQx0DiJ4VrqZPQIDAQABAoIBADO/xdOmPdeKyq+fRDiAEJRP1G+1WJEX1dmqh4Kw8htjsD3ll9anfiE+Jdo/aJ1YqX9NAudIau/qiOFiUXuMGig951kP0lhPJWcuH7nM0NIpvjb9EQPao+MJp1hDCv12ZjaZ4w8uqJ4/m7Wck/qrG4QuKJPw9fWmxqnyt0/QYhHgNtafKFtYXS3QLd4WL68n3plJUmbhZttzbewwxvB5W7IizzlLHDjPQA/PWvfmy8/zQmXH2PDrQAiIyWzPSzKyeecWsK5dbf/0RmS8dgkADg2ai7zh8Ma9dtdg7OGrgGI8I1nMuFolSoDNLktzhBMkKiN0rquPiQNs1YfxCOPef2ECgYEA/Ts3FMj23pfr9OlrHZ8a6R0fpjWLGlRV8uJnLdwYlamkn+JZJnP5l0iIvv/lKvCKihDSyP2J82fsgqyQ+nDDRdW8latTv8s2HSqKDFR4C31louinFdAGPF9rPf45ZOg97sy2E2M6PS8ehD2zShImdBe64jv1D7tJnK9RlwIV/ZkCgYEAvoy+QFYTRPaOWSFPV49cFfH1uLeWj2fbi2I8ZLEy/uvbSn48zifeRCbS4hcR/QdVFigZRTKNtreNYrZ6SW3/3EoJXhOdRdxRNTPCbCPjtzrIQNPR2qSnzvxTllFdSgItipIuLsdehPT9AMpfjtuc86y0yDzDsQF1iuKZfnL4l0UCgYEA35hIk267JGKKcs8jyJzy+wC/MFg4wf/TgEnOhxy/DG8lMBOBWkWvDZh7PgLfS+HmwfAG3neYNjb+C4fp32hv05rdEF6d7Uy2NFyaVjbDZInNk2HQHp920hoCrFNsRCAYh2F0J3xHMT0IugVs6KtMDtfhKN9+C+z4G4RmC2tJFYkCgYA47F6hZZVYErevlK3ZIHCH9cJMLjwCFyqU1wHnqq/rS5Y1CMUtaOeTQG3bML0k853NgqkZ7OI85VSNWqnpabz3l/54Zi+jgQ+Zbx7zoz0RrbPI+f5E7M9cnDB0RVYzF7d3H/g/7TslSPKT2+D0ElMu0DcpYk2rgR4WIV9tUPdGaQKBgG2zCSoO3/GSPBx9ldmgdRDw/wvhSbInqHPqOAVeSG8DTLr+SApJK5RK8q2Trkfw+k2Dw3c0RjtB97hez3mhecBMSG4h6DfV4c8auDiODHgvQ8GpmCn97GL9myykSPCoa0NvlkSAEK+PqATgrabsB5asCF59wePfCAtozyP3JTP/";

export const encryptPassword = async (password: string) => {
  const hashed_password = await bcrypt.hash(password, 10);
  if (!hashed_password) {
    return null;
  }

  return hashed_password;
};

export const generateToken = (user: any) => {
  if (!PRIVATE_KEY) return;
  return jwt.sign({ user }, PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });
};

export const verifyToken = async (token: string) => {
  if (!token || !token.startsWith("Bearer ")) return null;

  const formattedToken = token.split(" ")[1];
  const secret = new TextEncoder().encode(process.env.PRIVATE_KEY!);

  try {
    const { payload } = await jwtVerify(formattedToken, secret, {
      algorithms: ["HS256"],
    });

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: payload,
    };
  } catch (error: any) {
    if (Number(error.payload.exp) > Number(error.payload.iat)) {
      return {
        success: false,
        statusCode: 401,
        message: "Token expired",
        data: null,
      };
    }
    return {
      success: false,
      statusCode: 401,
      message: "Invalid token",
      data: null,
    };
  }
};
