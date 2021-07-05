<script lang="ts">
  import Button from "src/components/Button.svelte";
  import type { Api } from "src/api";
  import { getContext, onDestroy } from "svelte";
  import { navigate } from "svelte-routing";

  const api = getContext<Api>("api") as Api;

  const handleJoin = () => {
    navigate(`/AMA9`);
  };

  const handleCreate = () => {
    api.createRoom();
  };

  const subscription = api.roomCreated$.subscribe((id) => {
    navigate(`/${id}`);
  });

  onDestroy(() => {
    subscription.unsubscribe();
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
      <div class="code-cells">
        <input class="code-cell" />
        <input class="code-cell" />
        <input class="code-cell" />
        <input class="code-cell" />
      </div>
      <Button on:click={handleJoin} intent="primary">Join room</Button>
    </div>
    <div class="title-text or">Or</div>
    <Button on:click={handleCreate} intent="secondary">Create a new one</Button>
  </div>
  <div class="right">
    <img alt="logo" class="image" src="../../public/painting.jpg" />
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    background: var(--background-color);
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }

  .logo {
    font-family: Quicksand;
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    color: var(--primary-color);
  }

  .title {
    text-align: left;
  }

  .title-text {
    font-family: Nunito;
    font-weight: bold;
    font-size: 60px;
    line-height: 75px;
    color: #fff;
  }

  .code {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }

  .code-title {
    font-family: Quicksand;
    font-weight: 500;
    font-size: 16px;
    line-height: 25px;
    color: #abafc7;
    margin-bottom: 22px;
  }

  .code-cells {
    display: flex;
    margin-bottom: 22px;
  }

  .code-cell {
    width: 80px;
    height: 80px;

    background: #192431;
    border-radius: 20px;
    border: 0;

    margin-right: 14px;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
