"use client";

import { Button, Result, Typography } from "antd";
import Link from "next/link";

const { Paragraph } = Typography;

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Result
        status="403"
        title="403 - Доступ запрещен"
        subTitle="К сожалению, у вас нет необходимых прав для просмотра этой страницы."
        extra={[
          <Link href="/" key="home">
            <Button type="primary">На главную</Button>
          </Link>,
          <Link href="/login" key="login">
            <Button>Войти с другим аккаунтом</Button>
          </Link>,
        ]}
      />
      <Paragraph style={{ marginTop: "24px", color: "#8c8c8c" }}>
        Если вы считаете, что это ошибка, пожалуйста, свяжитесь с
        администратором.
      </Paragraph>
    </div>
  );
}
