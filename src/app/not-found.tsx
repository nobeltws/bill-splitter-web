import { styled } from "@linaria/react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-size: 15px;
  color: var(--color-muted-foreground);
`;

export default function NotFound() {
  return (
    <Wrapper>
      <Heading>Page Not Found</Heading>
      <Message>The session you&apos;re looking for doesn&apos;t exist.</Message>
    </Wrapper>
  );
}
