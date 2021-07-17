<script lang="ts">
  import Button from "src/components/Button.svelte";
  import type { Api } from "src/api";
  import { getContext, onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import Code from "./Code";

  let code;
  const api = getContext<Api>("api") as Api;

  const handleJoin = () => {
    navigate(`/${code}`);
  };

  const handleCreate = () => {
    api.createRoom();
  };

  let joinButton;

  function handleCodeReady() {
    joinButton.focus();
  }

  onMount(() => {
    const subscription = api.roomCreated$.subscribe((id) => {
      navigate(`/${id}`);
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="container">
  <div class="left">
    <div class="top">
      <div class="logo">Pixi</div>
      <div class="title title-text">
        Hey. <br />
        I’m your inspiration.
      </div>
    </div>
    <div class="code">
      <div class="code-title">Enter your room code</div>
      <div class="code-wrapper">
        <Code on:ready={handleCodeReady} bind:value={code} length={4} />
      </div>
      <Button bind:this={joinButton} on:click={handleJoin} intent="primary"
        >Join room</Button
      >
    </div>
    <div class="title-text or">Or</div>
    <Button on:click={handleCreate} intent="secondary">Join random</Button>
  </div>
  <div class="right">
    <img alt="logo" class="image" src="../../public/painting.webp" />
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    background: var(--color-background);
  }

  .top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .right,
  .left {
    width: 50%;
    padding: 80px;
  }

  .right {
    padding-left: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    padding-right: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .logo {
    font-weight: bold;
    font-size: var(--font-size-medium);
    line-height: 25px;
    color: var(--color-primary);
  }

  .title {
    text-align: left;
  }

  .title-text {
    font-weight: bold;
    font-size: var(--font-size-x-large);
    font-family: var(--font-family-secondary);
    line-height: 75px;
    color: var(--color-light);
  }

  .code {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
  .code-wrapper {
    padding-bottom: 22px;
  }

  .code-title {
    font-family: var(--font-family-primary);
    font-weight: 500;
    font-size: var(--font-size-small);
    line-height: 25px;
    color: var(--color-grey);
    margin-bottom: 22px;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
