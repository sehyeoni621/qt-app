"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createPostAction(input: {
  room: string;
  content: string;
  isAnonymous: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  const text = input.content.trim();
  if (!text) return { ok: false, reason: "empty" as const };
  if (text.length > 500) return { ok: false, reason: "too_long" as const };

  // 닉네임 조회
  const { data: p } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();
  const nickname =
    p?.nickname ?? user.email?.split("@")[0] ?? "익명";

  const { error } = await supabase.from("community_posts").insert({
    user_id: user.id,
    room: input.room,
    author_nickname: input.isAnonymous ? null : nickname,
    content: text,
    is_anonymous: input.isAnonymous,
  });
  if (error) return { ok: false, reason: error.message };

  revalidatePath(`/community`);
  revalidatePath(`/community/${encodeURIComponent(input.room)}`);
  return { ok: true };
}

export async function toggleLikeAction(postId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" as const };

  // 이미 좋아요 했는지 확인
  const { data: existing } = await supabase
    .from("community_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("community_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("community_likes")
      .insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/community", "layout");
  return { ok: true, liked: !existing };
}

export async function deletePostAction(postId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);
  revalidatePath("/community", "layout");
  return { ok: true };
}
