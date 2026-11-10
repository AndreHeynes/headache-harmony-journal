import { describe, it, expect } from "vitest";
import { isPublicPath, isPostSigninEntryPath } from "../publicRoutes";

describe("pages open to visitors", () => {
  it("privacy policy is readable before signup", () => {
    expect(isPublicPath("/policy")).toBe(true);
  });
  it("signup, trial, sample report and clinician sheet are open", () => {
    expect(isPublicPath("/signup")).toBe(true);
    expect(isPublicPath("/try")).toBe(true);
    expect(isPublicPath("/sample-report")).toBe(true);
    expect(isPublicPath("/clinicians")).toBe(true);
  });
  it("app areas stay closed to visitors", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/log")).toBe(false);
    expect(isPublicPath("/data-export")).toBe(false);
    expect(isPublicPath("/post-results")).toBe(false);
  });
});

describe("after signing in", () => {
  it("signing in from the auth page lands on the dashboard", () => {
    expect(isPostSigninEntryPath("/auth")).toBe(true);
    expect(isPostSigninEntryPath("/signup")).toBe(true);
  });
  it("signing in while reading the policy keeps you on the policy", () => {
    expect(isPostSigninEntryPath("/policy")).toBe(false);
  });
});
